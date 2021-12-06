var scene, camera, renderer, mesh;
var meshFloor;

var keyboard = {};
var player = { height: 1.8, speed: 0.2, turnSpeed: Math.PI * 0.02 };
var USE_WIREFRAME = false;

const floortexture = new THREE.TextureLoader().load('Dirt.jpg');
const walltexture = new THREE.TextureLoader().load('wall.jpg');

var RESOURCES_LOADED = false;

// Models index
var models = {
    grenade: {
        obj: "grenade_vintage.obj",
        mtl: "grenade_vintage.mtl",
        mesh: null,
        castShadow: false
    }
};

// Meshes index
var meshes = {};

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(90, 1280 / 720, 0.1, 1000);

    camera.position.set(14, 14, 14);
    camera.rotation.y = Math.PI;
    scene.add(camera);

    clock = new THREE.Clock();
    // mesh = new THREE.Mesh(
    //     new THREE.BoxGeometry(1, 1, 1),
    //     new THREE.MeshBasicMaterial({ color: 0xff4444, wireframe: USE_WIREFRAME })
    // );
    // mesh.position.y += 1; // Move the mesh up 1 meter
    // scene.add(mesh);

    let loaderBgBox = new THREE.CubeTextureLoader();
    let skyBoxBg = loaderBgBox.load(["assets/posx.png", "assets/negx.png", "assets/posy.png", "assets/negy.png", "assets/posz.png", "assets/negz.png"]);
    scene.background = skyBoxBg;


    // meshFloor = new THREE.Mesh(
    //     new THREE.PlaneGeometry(200, 200, 10, 10),
    //     new THREE.MeshBasicMaterial({
    //         map: floortexture,
    //         side: THREE.DoubleSide
    //     })
    // );
    // meshFloor.rotation.x -= Math.PI / 2; // Rotate the floor 90 degrees
    // scene.add(meshFloor);


    //set lighting
    let lights = [];
    const directLight1 = new THREE.DirectionalLight(0xffffff, 1);
    const ambientLight = new THREE.AmbientLight(0x555555, 1);

    directLight1.position.set(0, 6, 0);
    directLight1.target.position.set(0, 0, 0);

    lights.push(directLight1);
    lights.push(ambientLight);

    lights.forEach((light) => {
        scene.add(light);
    });

    lights[0].visible = true;
    lights[1].visible = true;

    const objects = [];

    function addObject(x, y, z, obj, spread) {
        obj.position.x = x * spread;
        obj.position.y = y * 15;
        obj.position.z = z * spread;

        scene.add(obj);
        objects.push(obj);
    }

    function addGeometry(x, y, z, spread, geometry, material) {
        const mesh = new THREE.Mesh(geometry, material);
        addObject(x, y, z, mesh, spread);
    }

    //make plane 1
    let plane; {
        const width = 250;
        const height = 5;
        const depth = 250;
        plane = new THREE.Mesh(
            new THREE.BoxGeometry(width, height, depth),
            new THREE.MeshStandardMaterial({
                // color: "rgb(0,255,255)",
                // roughness: 0.55,
                // metalness: 1,
                // side: THREE.DoubleSide,
                // emissive: 0x454545,
                map: floortexture,
                side: THREE.DoubleSide,
            })
        );
        addObject(0, -2.8, 0, plane, 15);
    }

    let wall = [];
    //make wall left
    {
        const width = 10;
        const height = 10;
        const depth = 250;
        const tmp = new THREE.Mesh(
            new THREE.BoxGeometry(width, height, depth),
            new THREE.MeshLambertMaterial({
                // color: "rgb(255,255,0)",
                // side: THREE.DoubleSide,
                // emissive: 0x454545,
                map: walltexture,
            })
        );
        wall.push(tmp);
        addObject(-7.8, -2.3, 0, wall[0], 15);
    }
    // make wall right
    {
        const width = 10;
        const height = 10;
        const depth = 250;
        const tmp = new THREE.Mesh(
            new THREE.BoxGeometry(width, height, depth),
            new THREE.MeshLambertMaterial({
                // color: "rgb(255,255,0)",
                // side: THREE.DoubleSide,
                // emissive: 0x454545,
                map: walltexture,
            })
        );
        wall.push(tmp);
        addObject(7.8, -2.3, 0, wall[1], 15);
    }

    // make wall up
    {
        const width = 250;
        const height = 10;
        const depth = 10;
        const tmp = new THREE.Mesh(
            new THREE.BoxGeometry(width, height, depth),
            new THREE.MeshLambertMaterial({
                // color: "rgb(255,255,0)",
                // side: THREE.DoubleSide,
                // emissive: 0x454545,
                map: walltexture,
            })
        );
        wall.push(tmp);
        addObject(0, -2.3, 7.8, wall[2], 15);
    }

    // make wall down
    {
        const width = 250;
        const height = 10;
        const depth = 10;
        const tmp = new THREE.Mesh(
            new THREE.BoxGeometry(width, height, depth),
            new THREE.MeshLambertMaterial({
                // color: "rgb(255,255,0)",
                // side: THREE.DoubleSide,
                // emissive: 0x454545,
                map: walltexture,
            })
        );
        wall.push(tmp);
        addObject(0, -2.3, -7.8, wall[3], 15);
    }

    let xPos = 0;
    let yPos = 0;
    let zPos = 0;
    let ball;
    // renderer.outputEncoding = THREE.sRGBEncoding;
    // renderer.toneMapping = THREE.ACESFilmicToneMapping;
    // renderer.toneMappingExposure = 0.25;

    // let envmaploader = new THREE.PMREMGenerator(renderer);


    //make ball
    {
        // new RGBELoader().setPath("assets/").load("moonless_golf_2k.hdr", function(hdrmap) {
        //     let envmap = envmaploader.fromCubemap(hdrmap);
        //     let texture = new THREE.CanvasTexture(new THREE.FlakesTexture());
        //     texture.wrapS = THREE.RepeatWrapping;
        //     texture.wrapT = THREE.RepeatWrapping;
        //     texture.repeat.x = 10;
        //     texture.repeat.y = 6;
        // });

        const radius = 2.0;
        const detail = 5;
        ball = new THREE.Mesh(new THREE.DodecahedronGeometry(radius, detail),
            new THREE.MeshPhongMaterial({
                color: "rgb(196,202,206)",
                shininess: 150,
            }));
        addObject(xPos + 7 - 7.5, yPos - 2.4, zPos + 7 - 7.5, ball, 14);

    }

    let map = [
        [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1],
        [1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1],
        [1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1],
        [1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1],
        [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
        [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1],
        [1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1],
        [1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1],
        [1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1],
        [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1],
        [1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0],
        [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0],
        [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0]

    ];

    for (let i = 0; i < 16; i++) {
        for (let j = 0; j < 16; j++) {
            if (map[j][i]) {
                const width = 14;
                const height = 10;
                const depth = 14;
                const tmp = new THREE.Mesh(
                    new THREE.BoxGeometry(width, height, depth),
                    new THREE.MeshLambertMaterial({
                        // color: "rgb(255,255,0)",
                        side: THREE.DoubleSide,
                        // emissive: 0x454545,
                        map: walltexture,
                    })
                );
                addObject(xPos + i + -7.5, -2.3, zPos + j - 7.5, tmp, 14);
            }
        }
    }





    // wall_1 = new THREE.Mesh(
    //     new THREE.BoxGeometry(200, 0.7, 50, 10),
    //     new THREE.MeshBasicMaterial({
    //         map: walltexture
    //     }));
    // wall_1.position.z = 100;
    // wall_1.rotation.x -= Math.PI / 2;
    // scene.add(wall_1);

    // wall_2 = new THREE.Mesh(
    //     new THREE.BoxGeometry(200, 0.7, 50, 10),
    //     new THREE.MeshBasicMaterial({
    //         map: walltexture
    //     }));
    // wall_2.position.z = -100;
    // wall_2.rotation.x -= Math.PI / 2;
    // scene.add(wall_2);

    // wall_3 = new THREE.Mesh(
    //     new THREE.BoxGeometry(200, 0.7, 50, 10),
    //     new THREE.MeshBasicMaterial({
    //         map: walltexture
    //     }));
    // wall_3.position.x = -100;
    // wall_3.rotation.x -= Math.PI / 2;
    // wall_3.rotation.z -= Math.PI / 2;
    // scene.add(wall_3);

    // wall_4 = new THREE.Mesh(
    //     new THREE.BoxGeometry(200, 0.7, 50, 10),
    //     new THREE.MeshBasicMaterial({
    //         map: walltexture
    //     }));
    // wall_4.position.x = 100;
    // wall_4.rotation.x -= Math.PI / 2;
    // wall_4.rotation.z -= Math.PI / 2;
    // scene.add(wall_4);

    // //Obstacles depan ke belakang

    // wall_5 = new THREE.Mesh(
    //     new THREE.BoxGeometry(200, 0.7, 50, 10),
    //     new THREE.MeshBasicMaterial({
    //         map: walltexture
    //     }));
    // wall_5.position.z = 85;
    // wall_5.position.x = 60;
    // wall_5.rotation.x -= Math.PI / 2;
    // scene.add(wall_5);

    // wall_6 = new THREE.Mesh(
    //     new THREE.BoxGeometry(200, 0.7, 50, 10),
    //     new THREE.MeshBasicMaterial({
    //         map: walltexture
    //     }));
    // wall_6.position.z = 70;
    // wall_6.position.x = -65;
    // wall_6.rotation.x -= Math.PI / 2;
    // scene.add(wall_6);

    // wall_7 = new THREE.Mesh(
    //     new THREE.BoxGeometry(200, 0.7, 50, 10),
    //     new THREE.MeshBasicMaterial({
    //         map: walltexture
    //     }));
    // wall_7.position.z = 55;
    // wall_7.position.x = 60;
    // wall_7.rotation.x -= Math.PI / 2;
    // scene.add(wall_7);

    // wall_8 = new THREE.Mesh(
    //     new THREE.BoxGeometry(200, 0.7, 50, 10),
    //     new THREE.MeshBasicMaterial({
    //         map: walltexture
    //     }));
    // wall_8.position.z = 40;
    // wall_8.position.x = -60;
    // wall_8.rotation.x -= Math.PI / 2;
    // scene.add(wall_8);

    // wall_9 = new THREE.Mesh(
    //     new THREE.BoxGeometry(200, 0.7, 50, 10),
    //     new THREE.MeshBasicMaterial({
    //         map: walltexture
    //     }));
    // wall_9.position.z = 25;
    // wall_9.position.x = 65;
    // wall_9.rotation.x -= Math.PI / 2;
    // scene.add(wall_9);

    // wall_10 = new THREE.Mesh(
    //     new THREE.BoxGeometry(200, 0.7, 50, 10),
    //     new THREE.MeshBasicMaterial({
    //         map: walltexture
    //     }));
    // wall_10.position.z = 10;
    // wall_10.position.x = -75;
    // wall_10.rotation.x -= Math.PI / 2;
    // scene.add(wall_10);

    // // wall_11 = new THREE.Mesh(
    // //     new THREE.BoxGeometry(200, 0.7, 50, 10),
    // //     new THREE.MeshBasicMaterial({
    // //         map: walltexture
    // //     }));
    // // wall_11.position.z = -5;
    // // wall_11.rotation.x -= Math.PI / 2;
    // // scene.add(wall_11);

    // // wall_12 = new THREE.Mesh(
    // //     new THREE.BoxGeometry(200, 0.7, 50, 10),
    // //     new THREE.MeshBasicMaterial({
    // //         map: walltexture
    // //     }));
    // // wall_12.position.z = -20;
    // // wall_12.position.x = -50;
    // // wall_12.rotation.x -= Math.PI / 2;
    // // scene.add(wall_12);

    // wall_13 = new THREE.Mesh(
    //     new THREE.BoxGeometry(120, 0.7, 50, 10),
    //     new THREE.MeshBasicMaterial({
    //         map: walltexture
    //     }));
    // wall_13.position.z = -35;
    // wall_13.position.x = 20;
    // wall_13.rotation.x -= Math.PI / 2;
    // scene.add(wall_13);

    // // wall_14 = new THREE.Mesh(
    // //     new THREE.BoxGeometry(200, 0.7, 50, 10),
    // //     new THREE.MeshBasicMaterial({
    // //         map: walltexture
    // //     }));
    // // wall_14.position.z = -50;
    // // wall_14.position.x = -70;
    // // wall_14.rotation.x -= Math.PI / 2;
    // // scene.add(wall_14);

    // wall_15 = new THREE.Mesh(
    //     new THREE.BoxGeometry(120, 0.7, 50, 10),
    //     new THREE.MeshBasicMaterial({
    //         map: walltexture
    //     }));
    // wall_15.position.z = -65;
    // wall_15.position.x = -20;
    // wall_15.rotation.x -= Math.PI / 2;
    // scene.add(wall_15);

    // // wall_16 = new THREE.Mesh(
    // //     new THREE.BoxGeometry(200, 0.7, 50, 10),
    // //     new THREE.MeshBasicMaterial({
    // //         map: walltexture
    // //     }));
    // // wall_16.position.z = -80;
    // // wall_16.position.x = -90;
    // // wall_16.rotation.x -= Math.PI / 2;
    // // scene.add(wall_16);

    // // Obstacles kanan ke kiri
    // wall_17 = new THREE.Mesh(
    //     new THREE.BoxGeometry(200, 0.7, 50, 10),
    //     new THREE.MeshBasicMaterial({
    //         map: walltexture
    //     }));
    // wall_17.position.x = -85;
    // wall_17.position.z = -100;
    // wall_17.rotation.x -= Math.PI / 2;
    // wall_17.rotation.z -= Math.PI / 2;
    // scene.add(wall_17);

    // wall_18 = new THREE.Mesh(
    //     new THREE.BoxGeometry(200, 0.7, 50, 10),
    //     new THREE.MeshBasicMaterial({
    //         map: walltexture
    //     }));
    // wall_18.position.x = -70;
    // wall_18.position.z = -100;
    // wall_18.rotation.x -= Math.PI / 2;
    // wall_18.rotation.z -= Math.PI / 2;
    // scene.add(wall_18);

    // // wall_19 = new THREE.Mesh(
    // //     new THREE.BoxGeometry(200, 0.7, 50, 10),
    // //     new THREE.MeshBasicMaterial({
    // //         map: walltexture
    // //     }));
    // // wall_19.position.x = -55;
    // // wall_19.rotation.x -= Math.PI / 2;
    // // wall_19.rotation.z -= Math.PI / 2;
    // // scene.add(wall_19);

    // // wall_20 = new THREE.Mesh(
    // //     new THREE.BoxGeometry(200, 0.7, 50, 10),
    // //     new THREE.MeshBasicMaterial({
    // //         map: walltexture
    // //     }));
    // // wall_20.position.x = -40;
    // // wall_20.rotation.x -= Math.PI / 2;
    // // wall_20.rotation.z -= Math.PI / 2;
    // // scene.add(wall_20);

    // // wall_21 = new THREE.Mesh(
    // //     new THREE.BoxGeometry(200, 0.7, 50, 10),
    // //     new THREE.MeshBasicMaterial({
    // //         map: walltexture
    // //     }));
    // // wall_21.position.x = -25;
    // // wall_21.rotation.x -= Math.PI / 2;
    // // wall_21.rotation.z -= Math.PI / 2;
    // // scene.add(wall_21);

    // // wall_22 = new THREE.Mesh(
    // //     new THREE.BoxGeometry(200, 0.7, 50, 10),
    // //     new THREE.MeshBasicMaterial({
    // //         map: walltexture
    // //     }));
    // // wall_22.position.x = -10;
    // // wall_22.rotation.x -= Math.PI / 2;
    // // wall_22.rotation.z -= Math.PI / 2;
    // // scene.add(wall_22);

    // // wall_23 = new THREE.Mesh(
    // //     new THREE.BoxGeometry(200, 0.7, 50, 10),
    // //     new THREE.MeshBasicMaterial({
    // //         map: walltexture
    // //     }));
    // // wall_23.position.x = 5;
    // // wall_23.rotation.x -= Math.PI / 2;
    // // wall_23.rotation.z -= Math.PI / 2;
    // // scene.add(wall_23);

    // // wall_24 = new THREE.Mesh(
    // //     new THREE.BoxGeometry(200, 0.7, 50, 10),
    // //     new THREE.MeshBasicMaterial({
    // //         map: walltexture
    // //     }));
    // // wall_24.position.x = 20;
    // // wall_24.rotation.x -= Math.PI / 2;
    // // wall_24.rotation.z -= Math.PI / 2;
    // // scene.add(wall_24);

    // // wall_25 = new THREE.Mesh(
    // //     new THREE.BoxGeometry(200, 0.7, 50, 10),
    // //     new THREE.MeshBasicMaterial({
    // //         map: walltexture
    // //     }));
    // // wall_25.position.x = 35;
    // // wall_25.rotation.x -= Math.PI / 2;
    // // wall_25.rotation.z -= Math.PI / 2;
    // // scene.add(wall_25);

    // // wall_26 = new THREE.Mesh(
    // //     new THREE.BoxGeometry(200, 0.7, 50, 10),
    // //     new THREE.MeshBasicMaterial({
    // //         map: walltexture
    // //     }));
    // // wall_26.position.x = 50;
    // // wall_26.position.z = 100;
    // // wall_26.rotation.x -= Math.PI / 2;
    // // wall_26.rotation.z -= Math.PI / 2;
    // // scene.add(wall_26);

    // // wall_27 = new THREE.Mesh(
    // //     new THREE.BoxGeometry(200, 0.7, 50, 10),
    // //     new THREE.MeshBasicMaterial({
    // //         map: walltexture
    // //     }));
    // // wall_27.position.x = 65;
    // // wall_27.rotation.x -= Math.PI / 2;
    // // wall_27.rotation.z -= Math.PI / 2;
    // // scene.add(wall_27);

    // wall_28 = new THREE.Mesh(
    //     new THREE.BoxGeometry(200, 0.7, 50, 10),
    //     new THREE.MeshBasicMaterial({
    //         map: walltexture
    //     }));
    // wall_28.position.x = 80;
    // wall_28.position.z = -100;
    // wall_28.rotation.x -= Math.PI / 2;
    // wall_28.rotation.z -= Math.PI / 2;
    // scene.add(wall_28);

    // // Instantiate a loader
    // const loader = new THREE.GLTFLoader();

    // // Load a glTF resource
    // loader.load(
    //     // resource URL
    //     'scene.gltf',
    //     // called when the resource is loaded
    //     function(gltf) {

    //         // gltf.scene.scale.set(3, 3, 3);
    //         // var object = gltf.scene;
    //         // object.position.x -= Math.PI / 2;
    //         // object.position.y = player.height;
    //         // object.position.z = -10;
    //         gltf.position.set(0, 2, 0);
    //         gltf.scale.set(4, 4, 4);

    //         scene.add(gltf);
    //     },
    //     // called
    //     // while loading is progressing
    //     function(xhr) {

    //         console.log((xhr.loaded / xhr.total * 100) + '% loaded');

    //     },
    //     // called when loading has errors
    //     function(error) {

    //         console.log('An error happened');

    //     }
    // );
    // const fbxLoader = new THREE.FBXLoader();
    // fbxLoader.load(
    //     '444.fbx',
    //     (object) => {
    //         // object.traverse(function (child) {
    //         //     if ((child as THREE.Mesh).isMesh) {
    //         //         // (child as THREE.Mesh).material = material
    //         //         if ((child as THREE.Mesh).material) {
    //         //             ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).transparent = false
    //         //         }
    //         //     }
    //         // })
    //         object.scale.set(4, 4, 4)
    //         scene.add(object)
    //     },
    //     (xhr) => {
    //         console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    //     },
    //     (error) => {
    //         console.log(error)
    //     }
    // )

    camera.position.set(ball.position.x, ball.position.y, ball.position.z);
    camera.lookAt(new THREE.Vector3(0, ball.position.y, 0));


    let moveForward = false;
    let moveBackward = false;
    let moveLeft = false;
    let moveRight = false;

    const onKeyDown = function(event) {

        switch (event.code) {

            case 'ArrowUp':
            case 'KeyW':
                moveForward = true;
                break;

            case 'ArrowLeft':
            case 'KeyA':
                moveLeft = true;
                break;

            case 'ArrowDown':
            case 'KeyS':
                moveBackward = true;
                break;

            case 'ArrowRight':
            case 'KeyD':
                moveRight = true;
                break;

            case 'Space':
                if (canJump === true) velocity.y += 350;
                canJump = false;
                break;

        }

    };

    const onKeyUp = function(event) {

        switch (event.code) {

            case 'ArrowUp':
            case 'KeyW':
                moveForward = false;
                break;

            case 'ArrowLeft':
            case 'KeyA':
                moveLeft = false;
                break;

            case 'ArrowDown':
            case 'KeyS':
                moveBackward = false;
                break;

            case 'ArrowRight':
            case 'KeyD':
                moveRight = false;
                break;

        }

    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(1280, 720);
    document.body.appendChild(renderer.domElement);

    // var controls = new THREE.OrbitControls(camera, renderer.domElement);

    animate();
}

function onResourcesLoaded() {
    // player weapon
    meshes["grenade"] = models.uzi.mesh.clone();
    meshes["grenade"].position.set(0, 2, 0);
    meshes["grenade"].scale.set(10, 10, 10);
    scene.add(meshes["grenade"]);
}

function keyboard_k() {
    let x = 0,
        z = 0;
    // Keyboard movement inputs
    if (keyboard[87]) { // W key
        z -= 1;
        camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
        camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;

    }
    if (keyboard[83]) { // S key
        z += 1;
        camera.position.x += Math.sin(camera.rotation.y) * player.speed;
        camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
    }
    if (keyboard[65]) { // A key
        x -= 1;
        // Redirect motion by 90 degrees
        camera.position.x += Math.sin(camera.rotation.y + Math.PI / 2) * player.speed;
        camera.position.z += -Math.cos(camera.rotation.y + Math.PI / 2) * player.speed;
    }
    if (keyboard[68]) { // D key
        x += 1;
        camera.position.x += Math.sin(camera.rotation.y - Math.PI / 2) * player.speed;
        camera.position.z += -Math.cos(camera.rotation.y - Math.PI / 2) * player.speed;
    }

    // Keyboard turn inputs
    if (keyboard[37]) { // left arrow key
        camera.rotation.y -= player.turnSpeed;
    }
    if (keyboard[39]) { // right arrow key
        camera.rotation.y += player.turnSpeed;
    }
}

function animate() {
    requestAnimationFrame(animate);

    // mesh.rotation.x += 0.01;
    // mesh.rotation.y += 0.02;
    keyboard_k();



    renderer.render(scene, camera);
}

function keyDown(event) {
    keyboard[event.keyCode] = true;
}

function keyUp(event) {
    keyboard[event.keyCode] = false;
}

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);

window.onload = init;