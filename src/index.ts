import {
  Scene,
  Color,
  Mesh,
  MeshNormalMaterial,
  BoxBufferGeometry,
  PerspectiveCamera,
  WebGLRenderer,
  OrthographicCamera,
  AmbientLight,
  PointLight,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

class Main {
  /** The scene */
  public scene: Scene;

  /** The camera */
  public camera: PerspectiveCamera | OrthographicCamera;

  /** The renderer */
  public renderer: WebGLRenderer;

  /** The orbit controls */
  public controls: OrbitControls;

  /** The cube mesh */
  public cube: Mesh;

  constructor() {
    this.initViewport();
  }

  /** Initialize the viewport */
  public initViewport() {
    // Init scene.
    this.scene = new Scene();
    this.scene.background = new Color("#191919");

    // Init camera.
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new PerspectiveCamera(50, aspect, 1, 1000);
    this.camera.position.z = 10;

    // Init renderer.
    this.renderer = new WebGLRenderer({
      powerPreference: "high-performance",
      antialias: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.render(this.scene, this.camera);
    // this.renderer.setAnimationLoop(() => this.animate()); // uncomment if you want to use the animation loop
    document.body.appendChild(this.renderer.domElement);
    window.addEventListener("resize", () => this.onResize());

    // Init orbit controls.
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.update();
    this.controls.addEventListener("change", () => this.render());
    var that = this;

    var loader = new GLTFLoader();
    loader.crossOrigin = "true";
    [1, 2, 3, 4]
      .map((n) => `/car${n}.glb`)
      .forEach((path, ix) =>
        loader.load(path, function (data) {
          var object = data.scene;
          object.position.set(ix * 3, 0, 0);
          that.scene.add(object);
        })
      );

    var lightAmb = new AmbientLight(0x202020, 3);
    lightAmb.position.set(30, -10, 30);
    this.scene.add(lightAmb);

    var lightPoint = new PointLight(0xffffff, 3, 50);
    lightPoint.position.set(4, 30, -20);
    this.scene.add(lightPoint);

    // Add test mesh.
    this.cube = this.createCubeMesh();
    //this.scene.add(this.cube);
    this.render();

    console.log(this);
  }

  /** Renders the scene */
  public render() {
    this.renderer.render(this.scene, this.camera);
  }

  /** Animates the scene */
  public animate() {
    this.cube.rotation.x += 0.005;
    this.cube.rotation.y += 0.001;

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  /** On resize event */
  public onResize() {
    if (this.camera instanceof PerspectiveCamera) {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    }
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.render();
  }

  /** Creates a cube mesh */
  public createCubeMesh() {
    const geometry = new BoxBufferGeometry(200, 200, 200);
    const material = new MeshNormalMaterial();
    const mesh = new Mesh(geometry, material);
    return mesh;
  }
}

new Main();
