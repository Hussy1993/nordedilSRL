document.addEventListener('DOMContentLoaded', function() {
    console.log("Caricamento nuova animazione NORD EDIL S.R.L...");

    if (typeof THREE === 'undefined') {
        console.error("Three.js non è caricato! Assicurati di includerlo nel tuo HTML.");
        return;
    }

    const container = document.getElementById('animation-container');
    if (!container) {
        console.error("Elemento 'animation-container' non trovato!");
        return;
    }

    container.innerHTML = ''; // Pulisce il container da animazioni precedenti

    let scene, camera, renderer, group;
    const nordEdilRed = 0xcf2e2e; // Rosso primario NORD EDIL
    let houseData = null; // Nuovo: per la casa singola
    let crane;

    // Variabili per l'animazione del gancio migliorata
    let hookAngle = 0;
    let hookSwingSpeed = 0.05;
    let hookMaxSwing = Math.PI / 180; // Oscillazione massima di 1 grado

    function init() {
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x1a202c); // Sfondo grigio-blu scuro professionale

        camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.set(0, 3, 10);

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
        directionalLight.position.set(5, 10, 7.5);
        directionalLight.castShadow = true;
        scene.add(directionalLight);

        const pointLight = new THREE.PointLight(0xffffff, 0.7, 50);
        pointLight.position.set(-5, 5, 5);
        scene.add(pointLight);

        group = new THREE.Group();
        scene.add(group);

        createCrane();
        createText();
        createHouse();

        window.addEventListener('resize', onWindowResize, false);
        onWindowResize(); // Chiamata iniziale per impostare la scala/posizione corretta
    }

    function createCrane() {
        crane = new THREE.Group();
        const craneMaterial = new THREE.MeshStandardMaterial({ color: nordEdilRed, roughness: 0.5, metalness: 0.3 });

        // Dimensioni aumentate per la gru
        const baseGeometry = new THREE.CylinderGeometry(0.3, 0.4, 0.7, 16); // Aumentato
        const base = new THREE.Mesh(baseGeometry, craneMaterial);
        base.position.y = 0.35;
        crane.add(base);

        const towerGeometry = new THREE.BoxGeometry(0.25, 4, 0.25); // Aumentato
        const tower = new THREE.Mesh(towerGeometry, craneMaterial);
        tower.position.y = 2.35;
        crane.add(tower);

        const armGeometry = new THREE.BoxGeometry(3.5, 0.2, 0.2); // Aumentato
        const arm = new THREE.Mesh(armGeometry, craneMaterial);
        arm.position.set(1.5, 4.2, 0);
        crane.add(arm);

        const counterweightGeometry = new THREE.BoxGeometry(0.5, 0.4, 0.4);
        const counterweight = new THREE.Mesh(counterweightGeometry, craneMaterial);
        counterweight.position.set(-1.1, 3.15, 0);
        arm.add(counterweight);

        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xaaaaaa });
        const points = [];
        points.push(new THREE.Vector3(1.8, 3.075, 0));
        points.push(new THREE.Vector3(1.8, 1.5, 0));
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const cable = new THREE.Line(lineGeometry, lineMaterial);
        arm.add(cable);

        const hookGeometry = new THREE.SphereGeometry(0.1, 16, 8);
        const hookMaterial = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.3 });
        const hook = new THREE.Mesh(hookGeometry, hookMaterial);
        hook.position.set(1.8, 1.5, 0);
        arm.add(hook);

        crane.position.set(-3, 0, 0); // Spostato leggermente per bilanciare
        crane.rotation.y = Math.PI / 6;
        group.add(crane);
    }

    function createHouse() {
        const houseGroup = new THREE.Group();
        const houseMaterial = new THREE.MeshStandardMaterial({ color: nordEdilRed, roughness: 0.6 });

        const baseHeight = 0.1;
        const baseWidth = 2;
        const baseDepth = 1.5;

        const baseGeometry = new THREE.BoxGeometry(baseWidth, baseHeight, baseDepth);
        const baseMesh = new THREE.Mesh(baseGeometry, houseMaterial);
        baseMesh.position.y = baseHeight / 2;
        houseGroup.add(baseMesh);

        const roofHeight = 0.1;
        const roofGeometry = new THREE.ConeGeometry(baseWidth * 0.75, roofHeight, 4);
        const roofMesh = new THREE.Mesh(roofGeometry, houseMaterial);
        roofMesh.position.y = baseHeight + (roofHeight / 2);
        roofMesh.rotation.y = Math.PI / 4;
        houseGroup.add(roofMesh);

        houseGroup.position.set(0, 0.2, -1.5);
        group.add(houseGroup);

        houseData = {
            group: houseGroup,
            baseMesh: baseMesh,
            roofMesh: roofMesh,
            currentBaseHeight: baseHeight,
            currentTargetBaseHeight: 2.5,
            currentRoofHeight: roofHeight,
            currentTargetRoofHeight: 1.5,
            isGrowing: true,
            baseWidth: baseWidth,
            baseDepth: baseDepth
        };
    }

    function createText() {
        const loader = new THREE.FontLoader();
        loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
            const textGeometry = new THREE.TextGeometry('NORD EDIL', {
                font: font,
                size: 1.2, // Aumentato da 0.8
                height: 0.3, // Aumentato da 0.2
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.05, // Aumentato
                bevelSize: 0.03, // Aumentato
                bevelOffset: 0,
                bevelSegments: 5
            });
            textGeometry.center();

            const textMaterial = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                roughness: 0.4,
                metalness: 0.1
            });
            const textMesh = new THREE.Mesh(textGeometry, textMaterial);
            textMesh.position.set(0, 0.5, 1.5); // Posizione migliorata
            group.add(textMesh);

            const srlTextGeometry = new THREE.TextGeometry('S.R.L.', {
                font: font,
                size: 0.25, // Aumentato da 0.15
                height: 0.08, // Aumentato
                curveSegments: 6,
                bevelEnabled: true,
                bevelThickness: 0.005,
                bevelSize: 0.005,
                bevelOffset: 0,
                bevelSegments: 3
            });
            srlTextGeometry.center();
            const srlTextMesh = new THREE.Mesh(srlTextGeometry, textMaterial);
            srlTextMesh.position.set(textMesh.position.x, textMesh.position.y - 0.175, textMesh.position.z);
            group.add(srlTextMesh);

        }, undefined, function (error) {
            console.error('Errore durante il caricamento del font:', error);
        });
    }

    function onWindowResize() {
        if (camera && renderer && container && group) {
            const aspect = container.clientWidth / container.clientHeight;
            camera.aspect = aspect;

            // Adattamento migliorato per rendere l'animazione più grande e visibile
            if (container.clientWidth < 480) { // Smartphone piccoli
                camera.fov = 90; // Aumentato da 85
                camera.position.set(0, 3, 10); // Avvicinato da (0, 4, 14)
                group.scale.set(0.8, 0.8, 0.8); // Aumentato da 0.6
                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            } else if (container.clientWidth < 768) { // Tablet e smartphone grandi
                camera.fov = 80; // Aumentato da 75
                camera.position.set(0, 2.5, 9); // Avvicinato da (0, 3.5, 12)
                group.scale.set(1.0, 1.0, 1.0); // Aumentato da 0.75
                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            } else if (container.clientWidth < 1024) { // Tablet landscape
                camera.fov = 70; // Aumentato da 65
                camera.position.set(0, 2.2, 8); // Avvicinato da (0, 3.2, 11)
                group.scale.set(1.1, 1.1, 1.1); // Aumentato da 0.9
                renderer.setPixelRatio(window.devicePixelRatio);
            } else { // Desktop
                camera.fov = 65; // Aumentato da 60
                camera.position.set(0, 2, 7); // Avvicinato da (0, 3, 10)
                group.scale.set(1.3, 1.3, 1.3); // Aumentato da 1.0
                renderer.setPixelRatio(window.devicePixelRatio);
            }

            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        }
    }

    let mouseX = 0, mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;
    let time = 0;

    // Eventi mouse e touch per interazione
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    
    // Touch events per dispositivi mobili
    let touchStartX = 0;
    let touchStartY = 0;
    let isTouching = false;
    
    container.addEventListener('touchstart', function(event) {
        if (event.touches.length === 1) {
            isTouching = true;
            touchStartX = event.touches[0].clientX;
            touchStartY = event.touches[0].clientY;
            event.preventDefault();
        }
    }, { passive: false });
    
    container.addEventListener('touchmove', function(event) {
        if (isTouching && event.touches.length === 1) {
            const touch = event.touches[0];
            const deltaX = touch.clientX - touchStartX;
            const deltaY = touch.clientY - touchStartY;
            
            // Sensibilità ridotta per touch
            const touchSensitivity = 0.0008;
            mouseX = deltaX * touchSensitivity;
            mouseY = deltaY * touchSensitivity;
            
            event.preventDefault();
        }
    }, { passive: false });
    
    container.addEventListener('touchend', function(event) {
        isTouching = false;
        // Graduale ritorno alla posizione neutra
        const returnSpeed = 0.95;
        const returnInterval = setInterval(() => {
            mouseX *= returnSpeed;
            mouseY *= returnSpeed;
            if (Math.abs(mouseX) < 0.001 && Math.abs(mouseY) < 0.001) {
                mouseX = 0;
                mouseY = 0;
                clearInterval(returnInterval);
            }
        }, 16);
        event.preventDefault();
    }, { passive: false });

    function onDocumentMouseMove(event) {
        if (!isTouching) { // Solo se non stiamo usando il touch
            // Sensibilità adattiva basata sulla dimensione dello schermo
            let sensitivityFactor;
            if (container.clientWidth < 480) {
                sensitivityFactor = 0.0008; // Molto ridotta per smartphone piccoli
            } else if (container.clientWidth < 768) {
                sensitivityFactor = 0.001; // Ridotta per mobile
            } else {
                sensitivityFactor = 0.002; // Standard per desktop
            }
            
            mouseX = (event.clientX - windowHalfX) * sensitivityFactor;
            mouseY = (event.clientY - windowHalfY) * sensitivityFactor;
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        time += 0.01;

        if (crane && crane.userData && crane.userData.arm) {
            // Velocità di rotazione adattiva per performance mobile
            const rotationSpeed = (container.clientWidth < 768) ? 0.002 : 0.003;
            crane.userData.arm.rotation.y += rotationSpeed;

            let hook = crane.userData.hook;
            let cable = crane.userData.cable;
            let hookY = hook.position.y;
            const armTopY = crane.userData.cableOrigin.y; // Y del punto di attacco del cavo sul braccio
            const minY = 0.5;    // Y minima del gancio
            // Velocità del gancio ottimizzata per mobile
            const hookSpeed = (container.clientWidth < 768) ? 0.006 : 0.008;

            hookY += hookSpeed * crane.userData.hookDirection;

            if (hookY > armTopY - 0.1) {
                hookY = armTopY - 0.1;
                crane.userData.hookDirection = -1;
            } else if (hookY < minY) {
                hookY = minY;
                crane.userData.hookDirection = 1;
            }
            hook.position.y = hookY;

            // Aggiungi un leggero ondeggiamento al gancio
            hookAngle += hookSwingSpeed;
            hook.position.x = crane.userData.cableOrigin.x + Math.sin(hookAngle) * hookMaxSwing * (armTopY - hookY); // L'oscillazione è più ampia quando il cavo è lungo
            hook.position.z = crane.userData.cableOrigin.z + Math.cos(hookAngle * 0.7) * hookMaxSwing * (armTopY - hookY) * 0.5; // Oscillazione anche sull'asse Z, meno pronunciata

            const cablePoints = cable.geometry.attributes.position.array;
            cablePoints[0] = crane.userData.cableOrigin.x; // x1
            cablePoints[1] = crane.userData.cableOrigin.y; // y1
            cablePoints[2] = crane.userData.cableOrigin.z; // z1
            cablePoints[3] = hook.position.x;             // x2
            cablePoints[4] = hook.position.y;             // y2
            cablePoints[5] = hook.position.z;             // z2
            cable.geometry.attributes.position.needsUpdate = true;
        }

        if (houseData && houseData.isGrowing) {
            let baseStillGrowing = false;
            let roofStillGrowing = false;

            if (houseData.currentBaseHeight < houseData.currentTargetBaseHeight) {
                houseData.currentBaseHeight += 0.005;
                baseStillGrowing = true;
            } else {
                houseData.currentBaseHeight = houseData.currentTargetBaseHeight;
            }

            if (houseData.currentRoofHeight < houseData.currentTargetRoofHeight) {
                houseData.currentRoofHeight += 0.003;
                roofStillGrowing = true;
            } else {
                houseData.currentRoofHeight = houseData.currentTargetRoofHeight;
            }

            if (!baseStillGrowing && !roofStillGrowing) {
                houseData.isGrowing = false;
            }

            houseData.baseMesh.geometry.dispose();
            houseData.baseMesh.geometry = new THREE.BoxGeometry(houseData.baseWidth, houseData.currentBaseHeight, houseData.baseDepth);
            houseData.baseMesh.position.y = houseData.currentBaseHeight / 2;

            houseData.roofMesh.geometry.dispose();
            houseData.roofMesh.geometry = new THREE.ConeGeometry(houseData.baseWidth * 0.75, houseData.currentRoofHeight, 4);
            houseData.roofMesh.position.y = houseData.currentBaseHeight + (houseData.currentRoofHeight / 2);
        }

        if (group) {
            // Fattore di smorzamento adattivo per mobile
            const dampingFactor = (container.clientWidth < 768) ? 0.03 : 0.05;
            const frictionFactor = (container.clientWidth < 768) ? 0.92 : 0.95;
            
            targetRotationY += (mouseX - group.rotation.y) * dampingFactor;
            targetRotationX += (mouseY - group.rotation.x) * dampingFactor;
            group.rotation.y += targetRotationY;
            group.rotation.x += targetRotationX;

            // Limiti di rotazione più conservativi per mobile
            const maxRotationX = (container.clientWidth < 768) ? Math.PI / 12 : Math.PI / 10;
            const maxRotationY = (container.clientWidth < 768) ? Math.PI / 10 : Math.PI / 8;
            
            group.rotation.x = Math.max(-maxRotationX, Math.min(maxRotationX, group.rotation.x));
            group.rotation.y = Math.max(-maxRotationY, Math.min(maxRotationY, group.rotation.y));
            
            targetRotationX *= frictionFactor;
            targetRotationY *= frictionFactor;
        }

        if (renderer && scene && camera) {
            renderer.render(scene, camera);
        }
    }

    try {
        init();
        animate();
        console.log("Nuova animazione NORD EDIL S.R.L. avviata con casa singola e gru migliorata.");
    } catch (error) {
        console.error("Errore durante l'inizializzazione della nuova animazione:", error);
        if (container) {
            const errorMessage = document.createElement('div');
            errorMessage.style.position = 'absolute';
            errorMessage.style.top = '50%';
            errorMessage.style.left = '50%';
            errorMessage.style.transform = 'translate(-50%, -50%)';
            errorMessage.style.color = 'red';
            errorMessage.style.background = 'rgba(0,0,0,0.7)';
            errorMessage.style.padding = '20px';
            errorMessage.style.borderRadius = '5px';
            errorMessage.style.fontFamily = 'Arial, sans-serif';
            errorMessage.innerHTML = `<h3>Errore Animazione</h3><p>Impossibile caricare l'animazione 3D. Dettagli: ${error.message}</p><p>Assicurati che Three.js sia caricato correttamente e che non ci siano conflitti con altri script.</p>`;
            container.appendChild(errorMessage);
        }
    }
});