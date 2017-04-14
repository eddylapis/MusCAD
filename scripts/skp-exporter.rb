require 'json'
require 'base64'
require 'delegate'

module MusCADExporter
  module Fake
    class ComponentInstance
      attr_reader :model
      def initialize(model); @model = model; end

      def parent; Struct.new(:id).new(nil); end
      def definition; model; end
      def transformation; Geom::Transformation.new; end
      def material; nil; end
    end

    class ComponentDefinition < SimpleDelegator
      def object_id; Sketchup.active_model.object_id; end
      def instances; @@cashe ||= [Fake::ComponentInstance.new(Sketchup.active_model)]; end
    end
  end

  def self.root; @@root ||= Fake::ComponentDefinition.new(Sketchup.active_model); end

  def self.export
    output = {
      _rootID: Sketchup.active_model.object_id,
      materials: get_materials,
      definitions: get_definitions,
      #references: get_references,
    }

    JSON.generate(output);
  end

  def self.camera_js
    c = Sketchup.active_model.active_view.camera
    <<-CAMERA_JS
    export default function a() {
      setTimeout(function() {
        _camLookAt(#{c.eye.to_a}, #{c.target.to_a}, #{c.up.to_a});
      },300);
    }
    CAMERA_JS
  end

  def self.get_definitions
    {}.tap do |hash|
      [root, *root.definitions].each { |obj| hash[obj.object_id] = Entity.wrap(obj) }
    end
  end

  def self.get_materials
    {}.tap do |hash|
      Sketchup.active_model.materials.each { |obj| hash[obj.object_id] = Entity.wrap(obj) }
    end
  end

  def self.get_references
    Hash.new { |h, k| h[k] = [] }.tap { |result|
      _loop_references(result,  Geom::Transformation.new, root.instances.first)
    }
  end

  def self._loop_references(result, acc_trans, current)
    @@counter ||= 0
    @@counter += 1

    current_abs_trans = acc_trans * current.transformation

    result[current.definition.object_id] << {
      id: current.object_id.to_s + @@counter.to_s,
      absTransMatrix: current_abs_trans.to_a,
      materialID: current.material && current.material.object_id,
    }

    _sub_entities(current).each do |ent|
      next unless _instance_like?(ent)
      _loop_references(result, current_abs_trans, ent)
    end
  end

  def self._instance_like?(ent)
    ent.is_a?(Sketchup::Group) || ent.is_a?(Sketchup::ComponentInstance)
  end

  def self._sub_entities(ent)
    return ent.entities if ent.respond_to?(:entities)
    return ent.definition.entities if ent.respond_to?(:definition)
    []
  end

  class Entity
    attr_reader :obj
    def initialize(obj)
      @obj = obj
    end

    def self.wrap(obj)
      namespace = MusCADExporter
      klass_str = obj.class.to_s.split('::').last
      klass = namespace.const_get(klass_str.to_sym)
      klass.new(obj)
    end

    def wrap(obj); self.class.wrap(obj); end
    def l_wrap; lambda { |obj| wrap(obj) }; end

    def id; obj.object_id; end
    def to_json(*a); JSON.generate(as_json(*a)); end

    # helpers
    def self.l_face; lambda { |e| e.is_a?(Sketchup::Face) }; end
    def self.l_edge; lambda { |e| e.is_a?(Sketchup::Edge) }; end
    def l_face; self.class.l_face; end
    def l_edge; self.class.l_edge; end
  end

  class Body < Entity
    attr_reader :faces, :edges
    def initialize(arr)
      @faces = arr.grep(l_face).map(&l_wrap)
      @edges = arr.grep(l_edge).map(&l_wrap)
    end

    def id; self.object_id; end

    def as_json(*a)
      {
        id: id,
        edges: edges,
        faces: faces,
      }
    end
  end

  class Point3d < Entity
    def as_json(*a); obj.to_a; end
  end

  class Vertex < Entity
    def as_json(*a)
      {
        id: id,
        position: wrap(obj.position).as_json,
      }
    end
  end

  class Edge < Entity
    def as_json(*a)
      {
        id: id,
        startID: obj.start.object_id,
        endID: obj.end.object_id,
        soft: obj.soft?,
      }
    end
  end

  class Face < Entity
    def material; obj.material; end
    def back_material; obj.back_material; end
    def inner_loops; obj.loops - [outer_loop]; end
    def outer_loop; obj.outer_loop; end
    def to_eid(l); l.edges.map(&:object_id) end

    def as_json(*a)
      {
        id: id,
        innerLoopsE: inner_loops.map {|l| to_eid(l) },
        outerLoopE: to_eid(outer_loop),
        materialID: material && material.object_id,
        backMaterialID: back_material && back_material.object_id,
      }
    end
  end

  class ComponentInstance < Entity
    def material; obj.material; end

    def as_json(*a)
      {
        id: id,
        parentDefinitionID: obj.parent.object_id,
        definitionID: obj.definition.object_id,
        materialID: material && material.object_id,
        transformationMatrix: obj.transformation.to_a,
      }
    end
  end

  class Group < ComponentInstance; end

  class ComponentDefinition < Entity
    attr_reader :bodies, :face_objs, :edge_objs, :vertices, :instances, :sub_instances

    def initialize(*a)
      super
      @face_objs = obj.entities.grep(l_face)
      @edge_objs = obj.entities.grep(l_edge)

      @vertices = @edge_objs.map(&:vertices).flatten.uniq.map(&l_wrap)
      @instances = obj.instances.map(&l_wrap)
      @sub_instances = (
        obj.entities.grep(Sketchup::ComponentInstance) + obj.entities.grep(Sketchup::Group)
      ).map(&l_wrap)

      @bodies = seperate_bodies([], @face_objs + @edge_objs).map { |arr| Body.new(arr) }
    end

    def seperate_bodies(acc, candidates)
      return acc if candidates.empty?

      a_body = candidates.first.all_connected
      seperate_bodies([a_body, *acc], candidates - a_body)
    end


    def as_json(*a)
      {
        id: id,
        bodies: bodies,
        vertices: vertices,
        instances: instances,
        subInstances: sub_instances,
      }
    end
  end

  class Model < ComponentDefinition
    def initialize(model)
      model.class.send(:define_method, :instances, lambda {[]})

      super(model)
    end
  end

  class Material < Entity
    def as_json(*a)
      {
        id: obj.object_id,
        color: self.wrap(obj.color).as_json,
        texture: obj.texture && self.wrap(obj.texture).as_json,
      }
    end
  end

  class Color < Entity
    def as_json(*a)
      obj.to_a.map {|v| v / 255.0}
    end
  end

  class Texture < Entity
    def self.base64(texture)
      tmpfile = File.join(Sketchup.temp_dir, 'export_tex_tmp')
      texture.write(tmpfile)

      bdata = nil
      File.open(tmpfile, 'rb') {|f| bdata = f.read}

      is_png = Proc.new { |str| str[1..3].eql? 'PNG' }
      is_jpg = Proc.new { |str| str[0..1].unpack('C*') == [255, 216] }

      case bdata
      when is_png
        'data:image/png;base64,' + "\n" + Base64.encode64(bdata)
      when is_jpg
        'data:image/jpeg;base64,'+ "\n" + Base64.encode64(bdata)
      else
        puts "#{texture} format unknown"
        <<-DUMMYIMG
        data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAA
        HElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==
        DUMMYIMG
      end
    end
    def as_json(*a)
      {
        height: obj.height,
        width: obj.width,
        base64: self.class.base64(obj),
      }
    end
  end
end
