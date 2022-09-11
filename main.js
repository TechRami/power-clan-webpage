//  importign threejs library

import './style.css'
import gsap from 'gsap'
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';



// importing dat gui

// import * as dat from 'dat.gui'; 
let input = document.querySelector('.playerName'); 
let playerName = document.querySelector('.dynamic-text')
input.addEventListener('input', resizeInput); 
resizeInput.call(input); 

function resizeInput() {
    

    if(input.value.length > 12) {
        playerName.style.width = input.value.length * 0.91 + "ch";
    } else {
        playerName.style.width = input.value.length + "ch";
    }
  }




// const gui = new dat.GUI();
const world = {
    plane: {
        width: 400,
        height: 400,
        widthSegments: 40, //50
        heightSegments: 26 //50

    }
}

// gui.add(world.plane, 'width', 1 ,500).onChange(generatePlane);
// gui.add(world.plane, 'height', 1 ,500).onChange(generatePlane);
// gui.add(world.plane, 'widthSegments', 1 ,70).onChange(generatePlane);
// gui.add(world.plane, 'heightSegments', 1 ,70).onChange(generatePlane);
    
    
function generatePlane() {
    mesh.geometry.dispose();
    mesh.geometry = new THREE.PlaneGeometry(
        world.plane.width,
        world.plane.height,
        world.plane.widthSegments,
        world.plane.heightSegments);


  // vertice position randomization
    const {array} = mesh.geometry.attributes.position;
    const randomValues = []
    for(let i = 0; i < array.length; i++) {
     
     if(i % 3 === 0){
         const x = array[i];
         const y = array[i+1];
         const z = array[i+2];

         array[i] = x + (Math.random() - 0.5) * 3;
         array[i + 1] = y + (Math.random() - 0.5) * 3;
         array[i + 2] = z + (Math.random() - 0.5 * 3)
     }
     randomValues.push(Math.random() * Math.PI * 2)
    }

    mesh.geometry.attributes.position.randomValues = randomValues
    mesh.geometry.attributes.position.originalPosition = mesh.geometry.attributes.position.array
     
        const colors = [];
        for(let i = 0; i < mesh.geometry.attributes.position.count; i++) {
            colors.push(1,1,1)
        } 
    
        mesh.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3)
        )
}




const raycaster = new THREE.Raycaster();
const scene = new THREE.Scene(); // creating a scene
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000); // creating a camera
/* 
the camera takes 4 arguments,
1- the field of view, the less it is, the closer or bigger the scene is
2- the camera aspect ratio
3- the near to camera value, when for example the camera is 0.1 close to an object, it will start clipping
4- the far to camera value, for example if it exceeds 1000 it will start disappearing/clipping
*/

const renderer = new THREE.WebGLRenderer(); // creating a renderer so we could render our scene


renderer.setSize(innerWidth, innerHeight); // setting the size of the render width and height
renderer.setPixelRatio(devicePixelRatio); // this is basically to match pixels of render with the screen to avoid visual problems
document.getElementById('app').appendChild(renderer.domElement) // appending our renderer element to the html so we could view it in the web

window.addEventListener('resize', function() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

new OrbitControls(camera, renderer.domElement)
camera.position.z = 50; 

const Geometry = new THREE.PlaneGeometry( // here we are creating the geometry
world.plane.width,
world.plane.height,
world.plane.widthSegments,
world.plane.heightSegments
// world.plane.width, world.plane.height, world.plane.widthSegments, world.plane.heightSegments
);


const material = new THREE.MeshPhongMaterial({side: THREE.DoubleSide, flatShading: true, vertexColors: true}); // creating a simple material for our mesh
// we set the double side property so we could see the two sides of our mesh, by default it wouldn't show

const mesh = new THREE.Mesh(Geometry, material); // here we are setting our mesh and its material
scene.add(mesh); // adding the mesh to our scene
generatePlane();


const light = new THREE.DirectionalLight( //creating light for our scene
    0xffffff, 1);
light.position.set(0, 1.4, 1) // takes 3 arguments, x y z
scene.add(light);


const seclight = new THREE.DirectionalLight( //creating light for our scene
    0xffffff, 0.4);
seclight.position.set(0, -1, 1) // takes 3 arguments, x y z
scene.add(seclight);

const thlight = new THREE.DirectionalLight( //creating light for our scene
    0xffffff, 0.05);
thlight.position.set(-1, 0, 1) // takes 3 arguments, x y z
scene.add(thlight);

const fthlight = new THREE.DirectionalLight( //creating light for our scene
    0xffffff, 0.05);
fthlight.position.set(1, 0, 1) // takes 3 arguments, x y z
scene.add(fthlight);

const backLight = new THREE.DirectionalLight( //creating light for our scene
    0xffffff, 1 );
backLight.position.set(0, 0, -1) // takes 3 arguments, x y z
scene.add(backLight);


const mouse = {
    x: undefined,
    y: undefined
}

//  ANIMATE FUNCTION

let frame = 0;
function animate() { // creating an animation for our mesh
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    raycaster.setFromCamera(mouse, camera)

    frame += 0.01

    const {
        array,
        originalPosition,
        randomValues} = mesh.geometry.attributes.position
    for(let i = 0; i < array.length; i+=3) {
    // x
    array[i] = originalPosition[i] + Math.cos(frame + randomValues[i]) * 0.01 / 1.5

    // y
    array[i + 1] =
      originalPosition[i + 1] + Math.sin(frame + randomValues[i + 1]) * 0.01 /1.5
 
 }
 

 mesh.geometry.attributes.position.needsUpdate = true

    const intersect = raycaster.intersectObject(mesh)
    if (intersect.length > 0) {

        const {color}= intersect[0].object.geometry.attributes

       
        intersect[0].object.geometry.attributes.color.needsUpdate = true


        const intialColor = {
            r: 1,
            g: 1,
            b: 1
        };

        const hoverColor = {
            r: 1,
            g: 1,
            b: 1
        };
        gsap.to(hoverColor, {
            r: intialColor.r,
            g: intialColor.g,
            b: intialColor.b,
            onUpdate: () => {
            // vertice 1
            color.setX(intersect[0].face.a, hoverColor.r)
            color.setY(intersect[0].face.a, hoverColor.g)
            color.setZ(intersect[0].face.a, hoverColor.b)

            // vertice 2
                color.setX(intersect[0].face.b, hoverColor.r)
                color.setY(intersect[0].face.b, hoverColor.g)
                color.setZ(intersect[0].face.b, hoverColor.b)
            // vertice 3
                color.setX(intersect[0].face.c, hoverColor.r)
                color.setY(intersect[0].face.c, hoverColor.g)
                color.setZ(intersect[0].face.c, hoverColor.b)
            }
        })
    }
    // mesh.rotation.x +=0.01
    // mesh.rotation.y +=0.01
}
animate();

addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / innerHeight) * 2 + 1;
    
})


