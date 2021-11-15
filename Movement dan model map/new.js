var scene, camera, renderer, mesh;
var meshFloor;

var keyboard = {};
var player = { height: 1.8, speed: 0.2, turnSpeed: Math.PI * 0.02 };
var USE_WIREFRAME = false;

const floortexture = new THREE.TextureLoader().load('Dirt.jpg');
const walltexture = new THREE.TextureLoader().load('wall.jpg');




function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(90, 1280 / 720, 0.1, 1000);

    // mesh = new THREE.Mesh(
    //     new THREE.BoxGeometry(1, 1, 1),
    //     new THREE.MeshBasicMaterial({ color: 0xff4444, wireframe: USE_WIREFRAME })
    // );
    // mesh.position.y += 1; // Move the mesh up 1 meter
    // scene.add(mesh);


    meshFloor = new THREE.Mesh(
        new THREE.PlaneGeometry(100, 100, 10, 10),
        new THREE.MeshBasicMaterial({
            map: floortexture,
            side: THREE.DoubleSide
        })
    );
    meshFloor.rotation.x -= Math.PI / 2; // Rotate the floor 90 degrees
    scene.add(meshFloor);

    wall_1 = new THREE.Mesh(
        new THREE.BoxGeometry(100, 0.7, 50, 10),
        new THREE.MeshBasicMaterial({
            map: walltexture
        }));
    wall_1.position.z = 50;
    wall_1.rotation.x -= Math.PI / 2;
    scene.add(wall_1);

    wall_2 = new THREE.Mesh(
        new THREE.BoxGeometry(100, 0.7, 50, 10),
        new THREE.MeshBasicMaterial({
            map: walltexture
        }));
    wall_2.position.z = -50;
    wall_2.rotation.x -= Math.PI / 2;
    scene.add(wall_2);

    wall_3 = new THREE.Mesh(
        new THREE.BoxGeometry(100, 0.7, 50, 10),
        new THREE.MeshBasicMaterial({
            map: walltexture
        }));
    wall_3.position.x = -50;
    wall_3.rotation.x -= Math.PI / 2;
    wall_3.rotation.z -= Math.PI / 2;
    scene.add(wall_3);

    wall_4 = new THREE.Mesh(
        new THREE.BoxGeometry(100, 0.7, 50, 10),
        new THREE.MeshBasicMaterial({
            map: walltexture
        }));
    wall_4.position.x = 50;
    wall_4.rotation.x -= Math.PI / 2;
    wall_4.rotation.z -= Math.PI / 2;
    scene.add(wall_4);

    // instantiate a loader
    // const loader = new THREE.OBJLoader;
    // // load a resource
    // loader.load('model/source/torcia.obj',
    //     // called when resource is loaded
    //     function(object) {

    //         scene.add(object);

    //     },
    //     // called when loading is in progresses
    //     function(xhr) {

    //         console.log((xhr.loaded / xhr.total * 100) + '% loaded');

    //     },
    //     // called when loading has errors
    //     function(error) {

    //         console.log('An error happened');

    //     }
    // );;

    camera.position.set(0, player.height, -5);
    camera.lookAt(new THREE.Vector3(0, player.height, 0));

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(1280, 720);
    document.body.appendChild(renderer.domElement);

    animate();
}

function animate() {
    requestAnimationFrame(animate);

    // mesh.rotation.x += 0.01;
    // mesh.rotation.y += 0.02;

    // Keyboard movement inputs
    if (keyboard[87]) { // W key
        camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
        camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
    }
    if (keyboard[83]) { // S key
        camera.position.x += Math.sin(camera.rotation.y) * player.speed;
        camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
    }
    if (keyboard[65]) { // A key
        // Redirect motion by 90 degrees
        camera.position.x += Math.sin(camera.rotation.y + Math.PI / 2) * player.speed;
        camera.position.z += -Math.cos(camera.rotation.y + Math.PI / 2) * player.speed;
    }
    if (keyboard[68]) { // D key
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