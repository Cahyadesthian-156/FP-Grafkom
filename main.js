let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 5000);
let renderer = new THREE.WebGLRenderer({ antialias: true });

document.body.appendChild(renderer.domElement);

camera.position.set(0, 15, 100);

renderer.setPixelRatio(devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

window.addEventListener("resize", function () {
  renderer.setSize(this.window.innerWidth, this.window.innerHeight);
  camera.aspect = this.window.innerWidth / this.window.innerHeight;
  camera.updateProjectionMatrix();
});

// [Orbital Control]
var controls = new THREE.OrbitControls(camera, renderer.domElement);
//controls.enableZoom = false;

//controls.autoRotate = true;
//controls.autoRotateSpeed = 0.5;
//controls.enableDamping = true;

// [Pointer Lock Control]
//const controls = new THREE.PointerLockControls(camera, renderer.domElement);
// controls.addEventListener("lock", function () {
//   menu.style.display = "none";
// });

// controls.addEventListener("unlock", function () {
//   menu.style.display = "block";
// });

// let clock = new THREE.Clock();
// //let controls = new THREE.FirstPersonControls(camera, renderer.domElement);
// controls.lookSpeed = 0.1;

// Pointlight
let pLight = new THREE.PointLight(0xffffff, 0.4);
pLight.position.set(200, 200, 200);
scene.add(pLight);

//.
//.
//.
// [ Skybox bg ]
let loaderBgBox = new THREE.CubeTextureLoader();
let skyBoxBg = loaderBgBox.load(["assets/posx.png", "assets/negx.png", "assets/posy.png", "assets/negy.png", "assets/posz.png", "assets/negz.png"]);
scene.background = skyBoxBg;

/*
const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(128, { format: THREE.RGBFormat, generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter });

let sphereCam = new THREE.CubeCamera(1, 1000, cubeRenderTarget);
sphereCam.position.set(0, 100, 0);
scene.add(sphereCam.renderTarget);

// .
let sphereGeo = new THREE.SphereGeometry(350, 50, 50);
let sphereMat = new THREE.MeshBasicMaterial({ envMap: sphereCam.cubeRenderTarget });
let sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
sphereMesh.position.set(0, 90, 0);
scene.add(sphereMesh);
*/

renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.25;

let envmaploader = new THREE.PMREMGenerator(renderer);

new THREE.RGBELoader().setPath("assets/").load("moonless_golf_2k.hdr", function (hdrmap) {
  let envmap = envmaploader.fromCubemap(hdrmap);
  let texture = new THREE.CanvasTexture(new THREE.FlakesTexture());
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.x = 10;
  texture.repeat.y = 6;

  const ballMaterial = {
    clearcoat: 10,
    clearcoatRoughness: 0.1,
    metalness: 0.9,
    roughness: 0.3,
    color: 0xf6f6f6,
    normalMap: texture,
    normalScale: new THREE.Vector2(0.15, 0.15),
    envMap: envmap.texture,
  };

  let sphereGeo = new THREE.SphereGeometry(5, 64, 64);

  for (let x = -10; x < 10; x++) {
    for (let y = -10; y < 10; y++) {
      let sphereMat = new THREE.MeshPhysicalMaterial(ballMaterial);
      let sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
      sphereMesh.position.set(Math.random() + x * 50, 15, Math.random() + y * 50);
      scene.add(sphereMesh);
    }
  }

  //   let sphereMat = new THREE.MeshPhysicalMaterial(ballMaterial);
  //   let sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
  //   sphereMesh.position.set(0, 15, 0);
  //   scene.add(sphereMesh);
});

// [Plane and Grid]
// [Plane]
let planeGeo = new THREE.PlaneGeometry(1000, 1000);
let planeMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, opacity: 0.95, transparent: true });
let planeMesh = new THREE.Mesh(planeGeo, planeMaterial);
planeMesh.rotation.x -= Math.PI / 2;
planeMesh.position.y += 10;
planeMesh.receiveShadow = true;
scene.add(planeMesh);

// [Grid]
var grid = new THREE.GridHelper(1000, 100, 0x0a0a0a, 0x000000);
grid.position.set(0, 10, 0);
scene.add(grid);

//
//
function updateScene() {
  renderer.render(scene, camera);
  //   controls.update(clock.getDelta());
  //sphereCam.updateCubeMap(renderer, scene);
  requestAnimationFrame(updateScene);
}

updateScene();
