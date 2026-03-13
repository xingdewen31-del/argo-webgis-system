import useStore from "@stores/mainstore.js";
import * as Cesium from 'cesium';

class CesiumImageryLayers1 {
    static ImageryLayer() {
        const imageryLayer = Cesium.ImageryLayer.fromProviderAsync(Cesium.ArcGisMapServerImageryProvider.fromBasemapType(Cesium.ArcGisBaseMapType.SATELLITE));
        return imageryLayer;
    }
}

class CesiumImageryLayers2 {
    static ImageryLayer() {
        const imageryLayer = Cesium.ImageryLayer.fromProviderAsync(Cesium.ArcGisMapServerImageryProvider.fromBasemapType(Cesium.ArcGisBaseMapType.HILLSHADE));
        return imageryLayer;
    }
}

class CesiumImageryLayers3 {
    static ImageryLayer() {
        const imageryLayer = Cesium.ImageryLayer.fromProviderAsync(Cesium.ArcGisMapServerImageryProvider.fromBasemapType(Cesium.ArcGisBaseMapType.OCEANS));
        return imageryLayer;
    }
}

class CesiumImageryLayers4 {
    static ImageryLayer1() {
        const imageryLayer1 = Cesium.ImageryLayer.fromProviderAsync(Cesium.ArcGisMapServerImageryProvider.fromBasemapType(Cesium.ArcGisBaseMapType.SATELLITE));
        return imageryLayer1;
    }

    static ImageryLayer2() {
        const imageryLayer2 = Cesium.ImageryLayer.fromProviderAsync(Cesium.ArcGisMapServerImageryProvider.fromBasemapType(Cesium.ArcGisBaseMapType.HILLSHADE));
        return imageryLayer2;
    }

    static ImageryLayer3() {
        const imageryLayer3 = Cesium.ImageryLayer.fromProviderAsync(Cesium.ArcGisMapServerImageryProvider.fromBasemapType(Cesium.ArcGisBaseMapType.OCEANS));
        return imageryLayer3;
    }
}

class CesiumImageryLayers5 {
    static selectlayer(id, viewer, value) {
        switch (value) {
            case 1:
                Cesium.ArcGisBaseMapType.SATELLITE;
            case 2:
                Cesium.ArcGisBaseMapType.HILLSHADE;
            case 3:
                Cesium.ArcGisBaseMapType.OCEANS;
        }
        const selectvalue = document.getElementById(id);
        selectvalue.addEventListener('change', (event) => {
            viewer.imageryLayers.removeAll();
            const value = Number(event.target.value);
            const imageryLayer = Cesium.ImageryLayer.fromProviderAsync(Cesium.ArcGisMapServerImageryProvider.fromBasemapType(Number(value)));
            viewer.imageryLayers.add(imageryLayer);
        });
    }
}

class CesiumImageryLayers6 {
    static clicklayer(id, viewer, value) {
        value = 1
        switch (value) {
            case 1:
                Cesium.ArcGisBaseMapType.SATELLITE;
            case 2:
                Cesium.ArcGisBaseMapType.HILLSHADE;
            case 3:
                Cesium.ArcGisBaseMapType.OCEANS;
        }

        let aaa = document.getElementById(id);
        aaa.onclick = function () {
            let bbb = document.getElementById(id).value;
            if (bbb === "1号图层") {
                document.getElementById(id).value = "2号图层";
                value = 2;
                viewer.imageryLayers.removeAll();
                const imageryLayer = Cesium.ImageryLayer.fromProviderAsync(Cesium.ArcGisMapServerImageryProvider.fromBasemapType(value));
                viewer.imageryLayers.add(imageryLayer);

            }
            if (bbb === "2号图层") {
                document.getElementById(id).value = "3号图层";
                value = 3
                viewer.imageryLayers.removeAll();
                const imageryLayer = Cesium.ImageryLayer.fromProviderAsync(Cesium.ArcGisMapServerImageryProvider.fromBasemapType(value));
                viewer.imageryLayers.add(imageryLayer);

            }
            if (bbb === "3号图层") {
                document.getElementById(id).value = "1号图层";
                value = 1
                viewer.imageryLayers.removeAll();
                const imageryLayer = Cesium.ImageryLayer.fromProviderAsync(Cesium.ArcGisMapServerImageryProvider.fromBasemapType(value));
                viewer.imageryLayers.add(imageryLayer);


            }
        }


    }
}

class CesiumImageryLayers7 {
    static ImageryLayer(viewer, value) {
        if (value == 1 || value == 2 || value == 3) {
            const imageryLayer = Cesium.ImageryLayer.fromProviderAsync(Cesium.ArcGisMapServerImageryProvider.fromBasemapType(Number(value)));
            viewer.imageryLayers.add(imageryLayer);
        } else {
            console.log("图层错误")
        }
    }
}

class CesiumImageryLayers8 {
    static addImageryLayers(viewer) {
        const basemapTypes = [1, 2, 3];

        for (let i = 0; i < basemapTypes.length; i++) {  // 从0开始循环
            const basemapType = basemapTypes[i];

            // 创建选定 Basemap 类型的影像图层
            const imageryLayer = Cesium.ImageryLayer.fromProviderAsync(
                Cesium.ArcGisMapServerImageryProvider.fromBasemapType(basemapType)
            )
            // 将影像图层添加到视图中
            viewer.imageryLayers.add(imageryLayer);

        }
    }
}

class WMS {
    static addWMS(viewer) {
        const options = {
            url: "http://localhost:8080/geoserver/topp/wms",
            layers: "topp:states",
            parameters: {
                transparent: true,
                format: "image/png",
            },
        };

        const imageryLayer = new Cesium.WebMapServiceImageryProvider(options);
        const layer = new Cesium.ImageryLayer(imageryLayer);
        viewer.imageryLayers.add(layer);
    }
}

class BOA {
    // 存储当前图层引用，便于后续移除
    static currentLayer = null;

    static destroy(viewer) {
        if (BOA.currentLayer) {
            viewer.imageryLayers.remove(BOA.currentLayer);
            BOA.currentLayer = null;
        }
    }

    static addBOA(viewer, layerName) {
        // 移除之前的图层
        this.destroy(viewer);

        // 配置WMS参数（动态传入图层名称和时间）
        const options = {
            url: "http://localhost:8080/geoserver/argo/wms",
            layers: layerName,
            parameters: {
                transparent: true,
                format: "image/png",

            }
        };

        // 创建新图层并添加
        const imageryProvider = new Cesium.WebMapServiceImageryProvider(options);
        BOA.currentLayer = viewer.imageryLayers.addImageryProvider(imageryProvider);
    }
}


class BIO {
    static addBIO(viewer) {
        const options = {
            url: "http://localhost:8080/geoserver/argo/wms",
            layers: "argo:temp",
            parameters: {
                transparent: true,
                format: "image/png",
            },
        };

        const imageryLayer = new Cesium.WebMapServiceImageryProvider(options);
        const layer = new Cesium.ImageryLayer(imageryLayer);
        viewer.imageryLayers.add(layer);
    }
}

class header {
    static addheader(viewer) {
        const options = {
            url: "http://localhost:8080/geoserver/argo/wms",
            layers: "argoheader",
            parameters: {
                transparent: true,
                format: "image/png",
            },
        };

        const imageryLayer = new Cesium.WebMapServiceImageryProvider(options);
        const layer = new Cesium.ImageryLayer(imageryLayer);
        viewer.imageryLayers.add(layer);
    }
}

class meta {
    static formatDate(date) {
        return [
            date.getFullYear(),
            String(date.getMonth() + 1).padStart(2, '0'),
            String(date.getDate()).padStart(2, '0')
        ].join('-') + ' ' + [  // [!code focus] 将 T 改为空格
            String(date.getHours()).padStart(2, '0'),
            String(date.getMinutes()).padStart(2, '0'),
            String(date.getSeconds()).padStart(2, '0')
        ].join(':');
    }

    static buildCqlFilter(params) {
        const {years, fmodels, dacs, Active, Inactive} = params;
        const filters = [];
        const today = new Date();

        // 处理时间范围（格式已更新）
        const fiveYearsAgo = new Date(today);
        fiveYearsAgo.setFullYear(today.getFullYear() - 5);

        if (Active && Inactive) {
            // 两者为真，不添加任何时间过滤条件（显示所有数据）
        } else if (Active && !Inactive) {
            filters.push(`launchdate >= '${this.formatDate(fiveYearsAgo)}'`);
        } else if (!Active && Inactive) {
            filters.push(`launchdate < '${this.formatDate(fiveYearsAgo)}'`);
        } else {
            // 两者为假，筛选今天的数据
            filters.push(`launchdate >= '${this.formatDate(fiveYearsAgo)}' AND launchdate < '${this.formatDate(fiveYearsAgo)}'`);
        }


        // 年份筛选
        if (years?.length > 0) {
            const yearConditions = years.map(y =>
                `(launchdate BETWEEN '${y}-01-01 00:00:00' AND '${y}-12-31 23:59:59')`  // [!code focus]
            );
            filters.push(`(${yearConditions.join(' OR ')})`);
        }

        // 模型筛选
        if (fmodels?.length > 0) {
            const safeModels = fmodels.map(m => m.replace(/'/g, "''"));
            filters.push(`platformmodel IN ('${safeModels.join("','")}')`);
        }

        // 数据中心筛选
        if (dacs?.length > 0) {
            const normalizedDacs = dacs.map(d =>
                d.slice(0, 2).toUpperCase().replace(/[^A-Z]/g, '')
            ).filter(Boolean);

            if (normalizedDacs.length > 0) {
                filters.push(`strSubstring(datacentre,0,2) IN ('${normalizedDacs.join("','")}')`);
            }
        }

        return filters.length > 0 ? filters.join(' AND ') : 'INCLUDE';
    }

    static async getStatusCounts(params) {
        try {
            // 并行获取活跃和非活跃浮标数量
            const [activeResponse, inactiveResponse] = await Promise.all([
                fetch('http://127.0.0.1:8000/argometa'),
                fetch('http://127.0.0.1:8000/argometa/inactive') // 新端点
            ]);

            // 处理活跃浮标响应
            let activeCount = 0;
            if (activeResponse.ok) {
                const activeData = await activeResponse.json();
                activeCount = activeData.count || 0;
            } else {
                console.error(`活跃浮标API请求失败: ${activeResponse.status}`);
            }

            // 处理非活跃浮标响应
            let inactiveCount = 0;
            if (inactiveResponse.ok) {
                const inactiveData = await inactiveResponse.json();
                inactiveCount = inactiveData.count || 0;
            } else {
                console.error(`非活跃浮标API请求失败: ${inactiveResponse.status}`);
            }

            console.log('Active:', activeCount, 'Inactive:', inactiveCount);
            return {active: activeCount, inactive: inactiveCount};

        } catch (err) {
            console.error('统计失败:', err);
            return {active: 0, inactive: 0};
        }
    }

    static addmeta(viewer, params) {
        try {
            // 移除旧图层：直接使用类名调用静态方法
            meta.removeExistingLayers(viewer); // [!code ++]

            // 创建新图层
            const cqlFilter = meta.buildCqlFilter(params); // [!code ++] // 同样建议使用类名
            console.log(cqlFilter);
            const provider = new Cesium.WebMapServiceImageryProvider({
                url: "http://localhost:8080/geoserver/argo_project/wms",
                layers: "argo_project:argometa",
                parameters: {
                    transparent: true,
                    format: "image/png",
                    CQL_FILTER: cqlFilter,
                    t: Date.now()
                }
            });

            return viewer.imageryLayers.addImageryProvider(provider);
        } catch (error) {
            console.error('图层加载失败:', error);
            return null;
        }
    }

    static removeExistingLayers(viewer) {
        const layers = [];
        for (let i = 0; i < viewer.imageryLayers.length; i++) {
            const layer = viewer.imageryLayers.get(i);
            if (layer.imageryProvider?.url?.includes('geoserver/argo_projec' +
                '/wms')) {
                layers.push(layer);
            }
        }
        layers.reverse().forEach(l => viewer.imageryLayers.remove(l));
    }
}

class TianWMTSimg {
    static addTianWMTSimg(viewer) {
        const provider = new Cesium.WebMapTileServiceImageryProvider({
            url: "http://t0.tianditu.gov.cn/img_w/wmts?tk=113505adc57b46897483569a61d061a9",
            layer: "img",
            style: "default",
            tileMatrixSetID: "w",
            maximumLevel: 18,
            format: "image/png",
        });
        const layer1 = new Cesium.ImageryLayer(provider);
        layer1.alpha = 1.0;
        viewer.imageryLayers.add(layer1);

        const annotationProvider = new Cesium.WebMapTileServiceImageryProvider({
            url: "http://t0.tianditu.gov.cn/cia_w/wmts?tk=113505adc57b46897483569a61d061a9",
            layer: "cia",
            style: "default",
            tileMatrixSetID: "w",
            maximumLevel: 18,
            format: "image/png",
        });

        const annotationLayer1 = new Cesium.ImageryLayer(annotationProvider);
        annotationLayer1.alpha = 1.0;
        viewer.imageryLayers.add(annotationLayer1);
    }
}

class TianWMTSter {
    static addTianWMTSter(viewer) {
        const provider = new Cesium.WebMapTileServiceImageryProvider({
            url: "http://t0.tianditu.gov.cn/ter_w/wmts?tk=113505adc57b46897483569a61d061a9",
            layer: "ter",
            style: "default",
            tileMatrixSetID: "w",
            maximumLevel: 18,
            format: "image/png",
        });
        const layer2 = new Cesium.ImageryLayer(provider);
        layer2.alpha = 1.0;
        viewer.imageryLayers.add(layer2);

        const annotationProvider = new Cesium.WebMapTileServiceImageryProvider({
            url: "http://t0.tianditu.gov.cn/cta_w/wmts?tk=113505adc57b46897483569a61d061a9",
            layer: "cta",
            style: "default",
            tileMatrixSetID: "w",
            maximumLevel: 18,
            format: "image/png",
        });

        const annotationLayer2 = new Cesium.ImageryLayer(annotationProvider);
        annotationLayer2.alpha = 1.0;
        viewer.imageryLayers.add(annotationLayer2);
    }
}

class TianWMTSvec {
    static addTianWMTSvec(viewer) {
        const provider = new Cesium.WebMapTileServiceImageryProvider({
            url: "http://t0.tianditu.gov.cn/vec_w/wmts?tk=113505adc57b46897483569a61d061a9",
            layer: "vec",
            style: "default",
            tileMatrixSetID: "w",
            maximumLevel: 18,
            format: "image/png",
        });
        const layer3 = new Cesium.ImageryLayer(provider);
        layer3.alpha = 1.0;
        viewer.imageryLayers.add(layer3);

        const annotationProvider = new Cesium.WebMapTileServiceImageryProvider({
            url: "http://t0.tianditu.gov.cn/cva_w/wmts?tk=113505adc57b46897483569a61d061a9", // 替换为你的实际密钥
            layer: "cva",
            style: "default",
            tileMatrixSetID: "w",
            maximumLevel: 18,
            format: "image/png",
        });

        const annotationLayer3 = new Cesium.ImageryLayer(annotationProvider);
        annotationLayer3.alpha = 1.0;
        viewer.imageryLayers.add(annotationLayer3);
    }
}

class DWMS {
    static addWMS(viewer) {
        const options = {
            url: "http://localhost:8080/geoserver/qimomap/wms",
            layers: "qimomap:dizheng",
            parameters: {
                transparent: true,
                format: "image/png",
            },
        };

        const imageryLayer = new Cesium.WebMapServiceImageryProvider(options);
        const layer1 = new Cesium.ImageryLayer(imageryLayer);
        viewer.imageryLayers.add(layer1);
    }
}

// coordinate-display.js
class CoordinateDisplay {
    static initialize(viewer, elementId = 'xyz') {
        // 参数校验
        if (!viewer || !(viewer instanceof Cesium.Viewer)) {
            throw new Error('必须传入有效的Cesium Viewer实例');
        }

        // 创建显示元素（如果不存在）
        let element = document.getElementById(elementId);
        if (!element) {
            element = document.createElement('div');
            element.id = elementId;
            element.style.cssText = `
                position: absolute;
                bottom: 40px;
                right: 10px;
                color: white;
                background: rgba(100, 150, 255, 0.25);
                backdrop-filter: blur(8px);
                border-radius: 12px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                font-family: 'Segoe UI', sans-serif;
                font-size: 14px;
                padding: 12px 16px;
                line-height: 1.6;
                z-index: 999;
                transition: all 0.3s ease-in-out;
            `;
            viewer.container.appendChild(element);
        }

        // 事件处理器
        const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

        // 十进制转度分秒
        const decimalToDMS = (decimal, isLatitude) => {
            const degrees = Math.floor(Math.abs(decimal));
            const minutes = Math.floor((Math.abs(decimal) - degrees) * 60);
            const seconds = ((Math.abs(decimal) - degrees - minutes / 60) * 3600).toFixed(2);
            return `${degrees}°${minutes}'${seconds}" ${isLatitude ? (decimal >= 0 ? 'N' : 'S') : (decimal >= 0 ? 'E' : 'W')}`;
        };

        // 鼠标移动处理
        handler.setInputAction(movement => {
            const position = viewer.camera.pickEllipsoid(
                movement.endPosition,
                viewer.scene.globe.ellipsoid
            );

            if (position) {
                const cartographic = Cesium.Cartographic.fromCartesian(position);
                const lat = Cesium.Math.toDegrees(cartographic.latitude);
                const lon = Cesium.Math.toDegrees(cartographic.longitude);
                const alt = (viewer.camera.positionCartographic.height / 1000).toFixed(2);

                element.innerHTML = `
                    <span style="color: #fb0620">纬度：</span>${decimalToDMS(lat, true)}<br>
                    <span style="color: #f8c10a">经度：</span>${decimalToDMS(lon, false)}<br>
                    <span style="color: #05c3ed">高度：</span>${alt} 千米
                `;
                element.style.display = 'block';
            } else {
                element.style.display = 'none';
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        // 返回销毁方法
        return () => {
            handler.destroy();
            element.remove();
        };
    }
}

export default CoordinateDisplay;


class WMSsvectorlayer {
    static removeExistingLayers(viewer) {
        const layers = [];
        for (let i = 0; i < viewer.imageryLayers.length; i++) {
            const layer = viewer.imageryLayers.get(i);
            if (layer.imageryProvider?.url?.includes('geoserver/argo_project/wms')) {
                layers.push(layer);
            }
        }
        layers.reverse().forEach(l => viewer.imageryLayers.remove(l));
    }

    static async addWMSsvectorlayer(viewer, url, layers, styles = '', where = '1=1', showcredit = false) {

        this.removeExistingLayers(viewer);
        const options = {
            url: url,
            layers: layers,
            parameters: {
                service: 'WMS',
                version: '1.3.0',
                format: 'image/png',
                transparent: true,
                styles: styles,
                cql_filter: where,
                crs: 'EPSG:4326'
            },
            credit: showcredit ? new Cesium.Credit(url) : undefined
        };
        try {
            const provider = new Cesium.WebMapServiceImageryProvider(options);
            const layer = await Cesium.ImageryLayer.fromProviderAsync(provider); // 等待图层加载完成
            layer.splitDirection = Cesium.SplitDirection.RIGHT; // 确保属性在加载后设置
            viewer.imageryLayers.add(layer);
            return viewer.imageryLayers.length;
        } catch (error) {
            console.error('加载WMS图层失败:', error);
            throw error;
        }
    }
}

class CoffeeBelt {
    static create(viewer, rectangleDegrees, numRectangles, heightInterval, outlineStyle) {
        if (!Array.isArray(rectangleDegrees) || rectangleDegrees.length !== 4) {
            console.error('Invalid rectangleDegrees, expected an array with 4 values.');
            return;
        }

        const scene = viewer.scene;
        const globe = scene.globe;

        // 保存原始状态
        const originalState = {
            showSkirts: globe.showSkirts,
            backFaceCulling: globe.backFaceCulling,
            undergroundColor: globe.undergroundColor,
            skyAtmosphere: scene.skyAtmosphere.show,
            // 显式保存原始区域限制状态（处理undefined情况）
            cartographicLimit: globe.cartographicLimitRectangle
                ? Cesium.Rectangle.clone(globe.cartographicLimitRectangle)
                : undefined
        };

        const coffeeBeltRectangle = Cesium.Rectangle.fromDegrees(...rectangleDegrees);

        // 应用新设置
        globe.cartographicLimitRectangle = coffeeBeltRectangle;
        globe.showSkirts = false;
        globe.backFaceCulling = false;
        globe.undergroundColor = undefined;
        scene.skyAtmosphere.show = false;

        // 创建矩形实体
        const rectangles = [];
        for (let i = 0; i < numRectangles; i++) {
            rectangles.push(viewer.entities.add({
                rectangle: {
                    coordinates: coffeeBeltRectangle,
                    material: Cesium.Color.TRANSPARENT,
                    height: i * heightInterval,
                    outline: true,
                    outlineWidth: outlineStyle.width,
                    outlineColor: outlineStyle.color,
                }
            }));
        }

        return {
            toggleLimit: (enabled) => {
                globe.cartographicLimitRectangle = enabled ? coffeeBeltRectangle : undefined;
            },
            toggleBounds: (visible) => {
                rectangles.forEach(rect => rect.show = visible);
            },
            destroy: () => {
                // 重置地球属性
                globe.showSkirts = originalState.showSkirts;
                globe.backFaceCulling = originalState.backFaceCulling;
                globe.undergroundColor = originalState.undergroundColor;
                scene.skyAtmosphere.show = originalState.skyAtmosphere;

                // 修复：确保完全解除区域限制
                if (originalState.cartographicLimit) {
                    // 恢复原始限制区域
                    globe.cartographicLimitRectangle = Cesium.Rectangle.clone(
                        originalState.cartographicLimit
                    );
                } else {
                    // 关键修复：使用最大矩形解除限制
                    globe.cartographicLimitRectangle = Cesium.Rectangle.MAX_VALUE;
                }

                // 移除所有矩形实体
                rectangles.forEach(rect => viewer.entities.remove(rect));
            }
        };
    }
}

export {CoffeeBelt};
export {CoordinateDisplay};
export {CesiumImageryLayers1};
export {CesiumImageryLayers2};
export {CesiumImageryLayers3};
export {CesiumImageryLayers4};
export {CesiumImageryLayers5};
export {CesiumImageryLayers6};
export {CesiumImageryLayers7};
export {CesiumImageryLayers8};
export {WMS};
export {TianWMTSimg};
export {TianWMTSter};
export {TianWMTSvec};
export {DWMS};
export {BIO}
export {BOA}
export {header}
export {meta}
export {WMSsvectorlayer}