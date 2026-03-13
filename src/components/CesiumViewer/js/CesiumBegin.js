// /* vue-untitled / 2025-05-13 / gis@jou.edu.cn */
// import * as Cesium from "cesium";
//
// class CesiumBegin {
//     static ning(container, baseurl = '/assets/cesium', extend = false) {
//         if (!Cesium) {
//             console.error('Missing API');
//             return undefined;
//         }
//         window.CESIUM_BASE_URL = baseurl;
//         Cesium.Ion.defaultAccessToken =
//             'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhNzc5YmU3Yi04NDAyLTQyNmQtOTA1Mi04ZDAwYzVhMGM2' +
//             'NzYiLCJpZCI6MTAzMDI4LCJpYXQiOjE2NTkxMTMyMjR9.q30BoB9iW8a1qWjHu2yBN22vsVvcGts372osJNTuBDc';
//
//         const options = {
//             infoBox: true,
//             vrButton: false,
//             geocoder: false,
//             timeline: false,
//             //baseLayer: false,
//             animation: false,
//             homeButton: false,
//             scene3DOnly: false,
//             shouldAnimate: true,
//             baseLayerPicker: false,
//             sceneModePicker: false,
//             //imageryProvider: false,
//             fullscreenButton: false,
//             projectionPicker: false,
//             selectionIndicator: true,
//             navigationHelpButton: false,
//             sceneMode: Cesium.SceneMode.SCENE3D,
//             navigationInstructionsInitiallyVisible: false,
//             // terrain: Cesium.Terrain.fromWorldTerrain(),
//             // requestRenderMode: true,
//             // maximumRenderTimeChange: Infinity,
//         };
//
//         const viewer = new Cesium.Viewer(container, options);
//         viewer.cesiumWidget.creditContainer.style.display = 'none';
//
//         const scene = viewer.scene;
//         scene.sun.show = false;
//         scene.skyBox.show = false;
//
//         const globe = scene.globe;
//         globe.show = true;
//         globe.translucency.enabled = false;
//         globe.baseColor = Cesium.Color.GAINSBORO;
//         globe.depthTestAgainstTerrain = false;
//
//
//         //viewer.cesiumWidget.showErrorPanel('测试', '地理信息', 'gis@jou.edu.cn');
//
//         if (extend) {
//             viewer.extend(Cesium.viewerDragDropMixin);
//             viewer.extend(Cesium.viewerPerformanceWatchdogMixin);
//             viewer.extend(Cesium.viewerCesiumInspectorMixin);
//         }
//         // Default Camera Position
//         // if (flyto) {
//         //     const [longitude, latitude, height, heading, pitch] = [119.215698337173, 34.6042520789146, 700, 0, -45];
//         //     const camera = viewer.camera;
//         //     camera.flyTo({
//         //         destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, height),
//         //         orientation: {
//         //             heading: Cesium.Math.toRadians(heading),
//         //             pitch: Cesium.Math.toRadians(pitch),
//         //             roll: 0.0
//         //         }
//         //     });
//         // }
//         //
//         // if (home) {
//         //     // Home Section
//         //     const xmin = 119.065117829867;
//         //     const ymin = 45.8955968828478;
//         //     const xmax = 119.150342668864;
//         //     const ymax = 45.9698186561991;
//         //     Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(xmin, ymin, xmax, ymax);
//         //     Cesium.Camera.DEFAULT_VIEW_FACTOR = 0.001;
//         // }
//
//         return viewer;
//     }
// }
//
// /* vue-untitled / 2025-05-13 / gis@jou.edu.cn */
// import * as Cesium from "cesium";
//
// class CesiumBegin {
//     static ning(container, baseurl = '/assets/cesium', extend = false) {
//         if (!Cesium) {
//             console.error('Missing API');
//             return undefined;
//         }
//         window.CESIUM_BASE_URL = baseurl;
//         Cesium.Ion.defaultAccessToken =
//             'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhNzc5YmU3Yi04NDAyLTQyNmQtOTA1Mi04ZDAwYzVhMGM2' +
//             'NzYiLCJpZCI6MTAzMDI4LCJpYXQiOjE2NTkxMTMyMjR9.q30BoB9iW8a1qWjHu2yBN22vsVvcGts372osJNTuBDc';
//
//         const options = {
//             infoBox: true,
//             vrButton: false,
//             geocoder: false,
//             timeline: false,
//             //baseLayer: false,
//             animation: false,
//             homeButton: false,
//             scene3DOnly: false,
//             shouldAnimate: true,
//             baseLayerPicker: false,
//             sceneModePicker: false,
//             //imageryProvider: false,
//             fullscreenButton: false,
//             projectionPicker: false,
//             selectionIndicator: true,
//             navigationHelpButton: false,
//             sceneMode: Cesium.SceneMode.SCENE3D,
//             navigationInstructionsInitiallyVisible: false,
//             // terrain: Cesium.Terrain.fromWorldTerrain(),
//             // requestRenderMode: true,
//             // maximumRenderTimeChange: Infinity,
//         };
//
//         const viewer = new Cesium.Viewer(container, options);
//         viewer.cesiumWidget.creditContainer.style.display = 'none';
//
//         const scene = viewer.scene;
//         scene.sun.show = false;
//         scene.skyBox.show = false;
//
//         const globe = scene.globe;
//         globe.show = true;
//         globe.translucency.enabled = false;
//         globe.baseColor = Cesium.Color.GAINSBORO;
//         globe.depthTestAgainstTerrain = false;
//
//
//         //viewer.cesiumWidget.showErrorPanel('测试', '地理信息', 'gis@jou.edu.cn');
//
//         if (extend) {
//             viewer.extend(Cesium.viewerDragDropMixin);
//             viewer.extend(Cesium.viewerPerformanceWatchdogMixin);
//             viewer.extend(Cesium.viewerCesiumInspectorMixin);
//         }
//         // Default Camera Position
//         // if (flyto) {
//         //     const [longitude, latitude, height, heading, pitch] = [119.215698337173, 34.6042520789146, 700, 0, -45];
//         //     const camera = viewer.camera;
//         //     camera.flyTo({
//         //         destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, height),
//         //         orientation: {
//         //             heading: Cesium.Math.toRadians(heading),
//         //             pitch: Cesium.Math.toRadians(pitch),
//         //             roll: 0.0
//         //         }
//         //     });
//         // }
//         //
//         // if (home) {
//         //     // Home Section
//         //     const xmin = 119.065117829867;
//         //     const ymin = 45.8955968828478;
//         //     const xmax = 119.150342668864;
//         //     const ymax = 45.9698186561991;
//         //     Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(xmin, ymin, xmax, ymax);
//         //     Cesium.Camera.DEFAULT_VIEW_FACTOR = 0.001;
//         // }
//
//         return viewer;
//     }
// }
//
// export default CesiumBegin;
import * as Cesium from "cesium";
import {Color} from "cesium";

class CesiumBegin {
    static cbing(container, baseurl = './assets/cesium', extend = false) {
        window.CESIUM_BASE_URL = baseurl;
        Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0Yjk3ZWJmNS0xOTBjLTRmMmEtYWU5OS1jYTcwNDYyMTQ0M2QiLCJpZCI6MjQwNDA2LCJpYXQiOjE3MjU5NjI1MjR9.FAapDekqXStmupf5maCNd9EBfezA9NEk8t9YmxJjAn8';

        const options = {
            sceneMode: 3,
            infoBox: false,
            vrButton: false,
            geocoder: false,
            timeline: false,
            baseLayer: false,
            animation: false,
            homeButton: false,
            shouldAnimate: true,
            baseLayerPicker: false,
            sceneModePicker: false,
            imageryProvider: false,
            fullscreenButton: false,
            projectionPicker: false,
            selectionIndicator: true,
            navigationHelpButton: false,
            navigationInstructionsInitiallyVisible: false,
        };

        const viewer = new Cesium.Viewer(container, options);

        // 隐藏Cesium标志的核心代码
        viewer.cesiumWidget.creditContainer.style.display = "none"; // 添加这行

        if (extend) {
            viewer.extend(Cesium.viewerDragDropMixin);
            viewer.extend(Cesium.viewerPerformanceWatchdogMixin);
            viewer.extend(Cesium.viewerCesiumInspectorMixin);
        }

        viewer.scene.globe.baseColor = Color.TRANSPARENT;
        viewer.scene.skyAtmosphere.show = false;

        return viewer;
    }
}

export default CesiumBegin;