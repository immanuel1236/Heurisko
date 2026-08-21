"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { geoContains } from "d3-geo";
import { feature } from "topojson-client";

export type LocationSelection = {
  name: string;
  country?: string;
  type: string;
  latitude: number;
  longitude: number;
};

type GlobeSceneProps = {
  autoRotate: boolean;
  showAtmosphere: boolean;
  onLocationSelect: (location: LocationSelection) => void;
  onDetailChange: (detail: "countries" | "states") => void;
  paused?: boolean;
};

type GeoGeometry = {
  type: string;
  coordinates: unknown;
};

type MapFeature = {
  type: "Feature";
  properties: { name: string; country?: string; type?: string };
  geometry: GeoGeometry;
};

function toPoint([longitude, latitude]: number[], radius = 1.006) {
  const phi = ((90 - latitude) * Math.PI) / 180;
  const theta = ((longitude + 180) * Math.PI) / 180;
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

function addRing(vertices: number[], ring: number[][]) {
  for (let i = 0; i < ring.length - 1; i += 1) {
    const start = toPoint(ring[i]);
    const end = toPoint(ring[i + 1]);
    vertices.push(start.x, start.y, start.z, end.x, end.y, end.z);
  }
}

function collectGeometry(vertices: number[], geometry: GeoGeometry) {
  if (geometry.type === "Polygon") {
    (geometry.coordinates as number[][][]).forEach((ring) => addRing(vertices, ring));
  }
  if (geometry.type === "MultiPolygon") {
    (geometry.coordinates as number[][][][]).forEach((polygon) =>
      polygon.forEach((ring) => addRing(vertices, ring)),
    );
  }
}

export default function GlobeScene({
  autoRotate,
  showAtmosphere,
  onLocationSelect,
  onDetailChange,
  paused = false,
}: GlobeSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ autoRotate, showAtmosphere, onLocationSelect, onDetailChange, paused });

  useEffect(() => {
    stateRef.current = { autoRotate, showAtmosphere, onLocationSelect, onDetailChange, paused };
  }, [autoRotate, showAtmosphere, onLocationSelect, onDetailChange, paused]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 3.25);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const globe = new THREE.Group();
    globe.rotation.set(0.14, -0.62, 0);
    scene.add(globe);

    const marker = new THREE.Mesh(
      new THREE.TorusGeometry(0.032, 0.005, 12, 48),
      new THREE.MeshBasicMaterial({ color: 0xdfff63, transparent: true, opacity: 0.95 }),
    );
    marker.visible = false;
    globe.add(marker);

    const earthMaterial = new THREE.ShaderMaterial({
      uniforms: {
        sunDirection: { value: new THREE.Vector3(-2, 1.1, 3).normalize() },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 sunDirection;
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          float light = dot(vNormal, sunDirection);
          float day = smoothstep(-0.18, 0.32, light);
          float rim = pow(1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0), 3.0);
          vec3 nightOcean = vec3(0.007, 0.027, 0.050);
          vec3 dayOcean = vec3(0.025, 0.255, 0.33);
          vec3 color = mix(nightOcean, dayOcean, day);
          color += vec3(0.02, 0.16, 0.19) * rim * day;
          gl_FragColor = vec4(color, 1.0);
        }
      `,
    });

    const earth = new THREE.Mesh(new THREE.SphereGeometry(1, 96, 96), earthMaterial);
    globe.add(earth);

    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.12, 64, 64),
      new THREE.ShaderMaterial({
        transparent: true,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          void main() {
            float intensity = pow(0.72 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
            gl_FragColor = vec4(0.18, 0.88, 0.92, 1.0) * intensity;
          }
        `,
      }),
    );
    scene.add(atmosphere);

    const graticuleMaterial = new THREE.LineBasicMaterial({
      color: 0x4ce0dc,
      transparent: true,
      opacity: 0.12,
    });
    const graticuleVertices: number[] = [];
    for (let lat = -60; lat <= 60; lat += 30) {
      const ring: number[][] = [];
      for (let lon = -180; lon <= 180; lon += 3) ring.push([lon, lat]);
      addRing(graticuleVertices, ring);
    }
    for (let lon = -150; lon <= 180; lon += 30) {
      const ring: number[][] = [];
      for (let lat = -90; lat <= 90; lat += 3) ring.push([lon, lat]);
      addRing(graticuleVertices, ring);
    }
    const gridGeometry = new THREE.BufferGeometry();
    gridGeometry.setAttribute("position", new THREE.Float32BufferAttribute(graticuleVertices, 3));
    globe.add(new THREE.LineSegments(gridGeometry, graticuleMaterial));

    const starsGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(900 * 3);
    for (let i = 0; i < starPositions.length; i += 3) {
      const distance = 7 + Math.random() * 8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPositions[i] = distance * Math.sin(phi) * Math.cos(theta);
      starPositions[i + 1] = distance * Math.sin(phi) * Math.sin(theta);
      starPositions[i + 2] = distance * Math.cos(phi);
    }
    starsGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    scene.add(
      new THREE.Points(
        starsGeometry,
        new THREE.PointsMaterial({ color: 0x92d9de, size: 0.018, transparent: true, opacity: 0.65 }),
      ),
    );

    let countryLines: THREE.LineSegments | null = null;
    let stateLines: THREE.LineSegments | null = null;
    let stateMaterial: THREE.LineBasicMaterial | null = null;
    let countryFeatures: MapFeature[] = [];
    let stateFeatures: MapFeature[] = [];
    const statesByCountry = new Map<string, MapFeature[]>();
    let disposed = false;
    fetch("/data/geography.topo.json")
      .then((response) => response.json())
      .then((topology) => {
        if (disposed) return;
        const countries = feature(topology, topology.objects.countries) as unknown as { features: MapFeature[] };
        const states = feature(topology, topology.objects.states) as unknown as { features: MapFeature[] };
        countryFeatures = countries.features;
        stateFeatures = states.features;
        stateFeatures.forEach((item) => {
          const key = item.properties.country ?? "";
          const entries = statesByCountry.get(key) ?? [];
          entries.push(item);
          statesByCountry.set(key, entries);
        });

        const countryVertices: number[] = [];
        countryFeatures.forEach(({ geometry }) => collectGeometry(countryVertices, geometry));
        const countryGeometry = new THREE.BufferGeometry();
        countryGeometry.setAttribute("position", new THREE.Float32BufferAttribute(countryVertices, 3));
        countryLines = new THREE.LineSegments(
          countryGeometry,
          new THREE.LineBasicMaterial({ color: 0xc9fff1, transparent: true, opacity: 0.78 }),
        );
        globe.add(countryLines);

        const stateVertices: number[] = [];
        stateFeatures.forEach(({ geometry }) => collectGeometry(stateVertices, geometry));
        const stateGeometry = new THREE.BufferGeometry();
        stateGeometry.setAttribute("position", new THREE.Float32BufferAttribute(stateVertices, 3));
        stateMaterial = new THREE.LineBasicMaterial({
          color: 0xdfff63,
          transparent: true,
          opacity: 0,
          depthWrite: false,
        });
        stateLines = new THREE.LineSegments(stateGeometry, stateMaterial);
        globe.add(stateLines);
      });

    let dragging = false;
    let previousX = 0;
    let previousY = 0;
    let pointerDownX = 0;
    let pointerDownY = 0;
    let moved = false;
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const selectLocation = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObject(earth, false)[0];
      if (!hit) return;

      const localPoint = globe.worldToLocal(hit.point.clone()).normalize();
      const latitude = THREE.MathUtils.radToDeg(Math.asin(localPoint.y));
      let longitude = THREE.MathUtils.radToDeg(Math.atan2(localPoint.z, -localPoint.x)) - 180;
      while (longitude < -180) longitude += 360;
      while (longitude > 180) longitude -= 360;
      const coordinate: [number, number] = [longitude, latitude];

      const country = countryFeatures.find((item) => geoContains(item as never, coordinate));
      const stateDetail = camera.position.z < 3.18;
      const indexedStates = country ? statesByCountry.get(country.properties.name) : undefined;
      const stateCandidates = indexedStates?.length ? indexedStates : stateFeatures;
      const region = stateDetail
        ? stateCandidates.find((item) => geoContains(item as never, coordinate))
        : undefined;
      const selected = region ?? country;
      if (!selected) return;

      marker.position.copy(localPoint).multiplyScalar(1.026);
      marker.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), localPoint);
      marker.visible = true;
      stateRef.current.onLocationSelect({
        name: selected.properties.name,
        country: region?.properties.country,
        type: region?.properties.type || "Country",
        latitude,
        longitude,
      });
    };

    const onPointerDown = (event: PointerEvent) => {
      dragging = true;
      previousX = event.clientX;
      previousY = event.clientY;
      pointerDownX = event.clientX;
      pointerDownY = event.clientY;
      moved = false;
      renderer.domElement.setPointerCapture(event.pointerId);
      renderer.domElement.classList.add("is-grabbing");
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return;
      if (Math.hypot(event.clientX - pointerDownX, event.clientY - pointerDownY) > 5) moved = true;
      globe.rotation.y += (event.clientX - previousX) * 0.006;
      globe.rotation.x += (event.clientY - previousY) * 0.004;
      globe.rotation.x = THREE.MathUtils.clamp(globe.rotation.x, -1.15, 1.15);
      previousX = event.clientX;
      previousY = event.clientY;
    };
    const onPointerUp = (event: PointerEvent) => {
      if (!moved) selectLocation(event);
      dragging = false;
      renderer.domElement.classList.remove("is-grabbing");
    };
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      camera.position.z = THREE.MathUtils.clamp(camera.position.z + event.deltaY * 0.002, 2.25, 5);
    };

    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("pointercancel", onPointerUp);
    renderer.domElement.addEventListener("wheel", onWheel, { passive: false });

    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(mount);
    resize();

    let frameId = 0;
    const clock = new THREE.Clock();
    let lastDetail: "countries" | "states" = "countries";
    const render = () => {
      const delta = Math.min(clock.getDelta(), 0.05);
      // Pause when off-screen or the tab is hidden — still schedules the next
      // frame so it resumes seamlessly, just skips the actual render/update
      // work while paused (a real cost-control requirement, not in the
      // original component).
      if (!stateRef.current.paused) {
        if (stateRef.current.autoRotate && !dragging) globe.rotation.y += delta * 0.065;
        atmosphere.visible = stateRef.current.showAtmosphere;
        const stateOpacity = THREE.MathUtils.clamp((3.22 - camera.position.z) / 0.72, 0, 1) * 0.62;
        if (stateMaterial) stateMaterial.opacity = stateOpacity;
        if (stateLines) stateLines.visible = stateOpacity > 0.01;
        const detail = camera.position.z < 3.18 ? "states" : "countries";
        if (detail !== lastDetail) {
          lastDetail = detail;
          stateRef.current.onDetailChange(detail);
        }
        renderer.render(scene, camera);
      }
      frameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      observer.disconnect();
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      renderer.domElement.removeEventListener("pointercancel", onPointerUp);
      renderer.domElement.removeEventListener("wheel", onWheel);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.LineSegments || object instanceof THREE.Points) {
          object.geometry.dispose();
          const material = object.material;
          if (Array.isArray(material)) material.forEach((item) => item.dispose());
          else material.dispose();
        }
      });
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="globe-canvas" aria-label="Interactive 3D globe. Drag to rotate, scroll to zoom, and click a place to identify it." />;
}
