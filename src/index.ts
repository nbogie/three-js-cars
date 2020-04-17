import {
  Scene,
  Color,
  Mesh,
  Object3D,
  MeshNormalMaterial,
  BoxBufferGeometry,
  PerspectiveCamera,
  WebGLRenderer,
  OrthographicCamera,
  AmbientLight,
  PointLight,
  Fog,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

class Car {
  public object: Object3D;
  public speed: number;
  constructor(obj3d: Object3D) {
    this.object = obj3d;
    this.speed = 0.1 + Math.random() * 0.2;
  }
}

class Main {
  /** The scene */
  public scene: Scene;

  /** The camera */
  public camera: PerspectiveCamera | OrthographicCamera;

  /** The renderer */
  public renderer: WebGLRenderer;

  /** The orbit controls */
  public controls: OrbitControls;

  public cars: Car[];

  public lightPoint: PointLight;

  constructor() {
    this.setupEverything();
  }

  /** Initialize the viewport */
  public setupEverything() {
    // Init scene.
    this.scene = new Scene();
    this.scene.background = new Color("#191919");

    // Init camera.
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new PerspectiveCamera(50, aspect, 1, 1000);
    this.camera.position.y = 10;
    this.camera.position.z = 60;
    this.camera.position.x = -6;

    // Init renderer.
    this.renderer = new WebGLRenderer({
      powerPreference: "high-performance",
      antialias: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.render(this.scene, this.camera);
    // uncomment if you want to use the animation loop
    this.renderer.setAnimationLoop(() => this.animate());
    document.body.appendChild(this.renderer.domElement);
    window.addEventListener("resize", () => this.onResize());

    // Init orbit controls.
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.update();
    this.controls.addEventListener("change", () => this.render());

    //Add some lights
    var lightAmb = new AmbientLight(0x202020, 6);
    lightAmb.position.set(30, -10, 30);
    this.scene.add(lightAmb);

    this.lightPoint = new PointLight(0xffffff, 3, 20);
    this.lightPoint.position.set(4, 30, -20);
    this.scene.add(this.lightPoint);
    this.scene.fog = new Fog(0xff0000, 250, 1400);

    //load the models, add them to the scene, remember them
    this.cars = [];
    var loader = new GLTFLoader();
    loader.crossOrigin = "true";
    [1, 2, 3, 4, 5, 6]
      .map((n) => `/car${n}.glb`)
      .forEach((path, ix) =>
        loader.load(path, (data) => {
          var object = data.scene;
          object.position.set(-10 + ix * 4, 0, 0);
          this.scene.add(object);
          this.cars.push(new Car(object.children[0]));
          this.render();
        })
      );

    this.render(); //want this only once the models have loaded
  } //ends Main initViewport()

  /** Renders the scene */
  public render() {
    this.renderer.render(this.scene, this.camera);
  }

  /** Animates the scene */
  public animate() {
    this.cars.forEach((car) => {
      //car.object.rotation.y += 0.005;
      car.object.position.z += car.speed;
      if (car.object.position.z > 100) {
        car.object.position.z -= 100;
      }
    });
    if (this.cars.length > 0) {
      this.camera.lookAt(this.cars[0].object.position);
    }
    //this.lightPoint.rotateZ(Math.random() * 100);
    //    this.controls.update();
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
}

new Main();
