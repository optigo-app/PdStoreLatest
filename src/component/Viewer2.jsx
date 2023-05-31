import React, { useEffect, useRef } from "react";
import {
  ViewerApp,
  AssetManagerPlugin,
  addBasePlugins,
  MaterialConfiguratorPlugin,
  MaterialConfiguratorBasePlugin,
  DiamondPlugin,
  CameraView,
  CameraViewPlugin,
  CanvasSnipperPlugin,
  FileTransferPlugin,
  timeout,
} from "webgi";
// import './viewer.css'

class CustomMaterialConfiguratorPlugin extends MaterialConfiguratorBasePlugin {
  // This must be set to exactly this.
  static PluginType = "MaterialConfiguratorPlugin";

  // this function is automatically called when an object is loaded with some material variations
  async _refreshUi() {
    if (!(await super._refreshUi())) return false; // check if any data is changed.
    const configuratorDiv = document.getElementById("mconfigurator");

    configuratorDiv.innerHTML = "";

    for (const variation of this.variations) {
      const container = document.createElement("div");
      container.classList.add("variations");
      container.textContent = variation.title;
      configuratorDiv.appendChild(container);
      const div = document.createElement("div");
      const select = document.createElement("select");

      variation.materials.map((material) => {
        // material is the variation that can be applied to an object

        let image;
        if (!variation.preview.startsWith("generate:")) {
          const pp = material[variation.preview] || "#ff00ff";
          image = pp.image || pp;
        } else {
          // Generate a small snapshot of the material preview based on some shape (optional)
          image = this._previewGenerator.generate(
            material,
            variation.preview.split(":")[1]
          );
        }
        // callback to change the material variations
        const onClick = () => {
          this.applyVariation(variation, material.uuid);
        };
        // Generate a UI from this data.
        console.log({
          uid: material.uuid,
          color: material.color,
          material: material,
          image,
          onClick,
        });
        const button = document.createElement("button");
        button.innerHTML =
          '<img src="' + image + '" alt="' + material.name + '"/>';
        button.onclick = onClick;
        div.append(button);

        const option = document.createElement("option");
        option.value = material.name;
        option.innerText = material.name;
        select.append(option);
        select.addEventListener("change", onClick());
        div.append(select);
        /* button.innerHTML =
          '<img src="' + image + '" alt="' + material.name + '"/>'; */
        // button.onclick = onClick;
        // div.append(button);
      });
      container.append(div);
    }
    return true;
  }
}

/* function CustomMaterialConfiguratorPlugin() {
  const _refreshUi = async () => {
    const result = await Object.getPrototypeOf(CustomMaterialConfiguratorPlugin.prototype)._refreshUi.apply(this);
    if (!result) return false;
    const configuratorDiv = document.getElementById("mconfigurator");
    configuratorDiv.innerHTML = "";
    for (const variation of this.variations) {
      const container = document.createElement("div");
      container.classList.add("variations");
      container.textContent = variation.title;
      configuratorDiv.appendChild(container);
      variation.materials.map((material) => {
        let image;
        if (!variation.preview.startsWith("generate:")) {
          const pp = material[variation.preview] || "#ff00ff";
          image = pp.image || pp;
        } else {
          image = this._previewGenerator.generate(
            material,
            variation.preview.split(":")[1]
          );
        }
        const onClick = () => {
          this.applyVariation(variation, material.uuid);
        };
        const button = document.createElement("button");
        button.innerHTML = `<img src=${image}/>` + material.name;
        // button.innerHTML = `<img src={require(${image}).default}/>` + material.name;
        button.onclick = onClick;
        container.append(button);
      });
    }
    return true;
  };

  const plugin = Object.create(MaterialConfiguratorBasePlugin.prototype);
  plugin.constructor = CustomMaterialConfiguratorPlugin;
  CustomMaterialConfiguratorPlugin.prototype = plugin;

  CustomMaterialConfiguratorPlugin.prototype._refreshUi = _refreshUi;

  return CustomMaterialConfiguratorPlugin;
} */

const canvasElement = document.createElement("canvas");
canvasElement.style.width = "100%";
canvasElement.style.height = "100%";

let viewer,
  viewerInit = false;

const resetModel = async (
  glb,
  json,
  primaryMetDmat,
  secondaryMetDmat,
  sideDia,
  diaDmat,
  sideDiaStarts,
  isSideDiaAvail,
  diaNameStarts,
  diaName,
  metal1NameStarts,
  metal2NameStarts,
  twoTone
) => {
  if (!viewer || !viewerInit) {
    return;
  }
  let manager = viewer.getManager();
  if (!manager) {
    return;
  }
  viewer.scene.removeSceneModels();
  await manager.addFromPath(glb, { autoScale: true, autoCenter: true });
  await manager.addFromPath(json);
  await manager.addFromPath("/preset.CameraViews.json");

  await resetMaterial(
    primaryMetDmat,
    secondaryMetDmat,
    sideDia,
    diaDmat,
    sideDiaStarts,
    isSideDiaAvail,
    diaNameStarts,
    diaName,
    metal1NameStarts,
    metal2NameStarts,
    twoTone
  );
};

const resetMaterial = async (
  primaryMetDmat,
  secondaryMetDmat,
  sideDia,
  diaDmat,
  sideDiaStarts,
  isSideDiaAvail,
  diaNameStarts,
  diaName,
  metal1NameStarts,
  metal2NameStarts,
  twoTone
) => {
  if (!viewer || !viewerInit) {
    return;
  }

  const primaryMetal = await viewer
    .getManager()
    .importer.importSinglePath(primaryMetDmat);
  const secondaryMetal =
    secondaryMetDmat !== undefined
      ? await viewer.getManager().importer.importSinglePath(secondaryMetDmat)
      : "";
  const diamondMaterial = await viewer
    .getManager()
    .importer.importSinglePath(diaDmat);
  const sideDiamondMaterial = await viewer
    .getManager()
    .importer.importSinglePath(sideDia);

  viewer.scene.traverse((obj) => {
    if (isSideDiaAvail && obj.name.startsWith(sideDiaStarts) && obj.material) {
      //gem or side diamond
      viewer
        .getPlugin(DiamondPlugin)
        .makeDiamond(
          obj.material,
          { cacheKey: "shape", normalMapRes: 512 },
          { isDiamond: true, color: 0xa1a1f0, refractiveIndex: 2.4 }
        );
      obj.setMaterial(sideDiamondMaterial);
    } else if (
      !isSideDiaAvail &&
      obj.name.startsWith(diaNameStarts) &&
      obj.material
    ) {
      viewer
        .getPlugin(DiamondPlugin)
        .makeDiamond(
          obj.material,
          { cacheKey: "shape", normalMapRes: 512 },
          { isDiamond: true, color: 0xa1a1f0, refractiveIndex: 2.4 }
        );
      obj.setMaterial(diamondMaterial);
    } else if (obj.name.startsWith(diaNameStarts) && obj.name === diaName) {
      //center diamond
      viewer
        .getPlugin(DiamondPlugin)
        .makeDiamond(
          obj.material,
          { cacheKey: "shape", normalMapRes: 512 },
          { isDiamond: true, color: 0xa1a1f0, refractiveIndex: 2.4 }
        );
      obj.setMaterial(diamondMaterial);
    }
    if (obj.name.startsWith(metal1NameStarts) && obj.material) {
      //metal
      if (metal2NameStarts === undefined) {
        obj.setMaterial(primaryMetal);
      }
      if (
        secondaryMetal !== "" &&
        twoTone &&
        metal2NameStarts !== undefined &&
        obj.name === metal2NameStarts
      ) {
        obj.setMaterial(secondaryMetal);
      }
    }    
  });
  let camViews = viewer.getPlugin(CameraViewPlugin);
  let snipper = viewer.getPlugin(CanvasSnipperPlugin);

  await camViews.animateToView(camViews.camViews[2]);

  await viewer.setDirty(); // trigger a rerender.
  await snipper.downloadSnapshot("image.png", {
    waitForProgressive: true, // download anti-aliased image
  });

  await timeout(100);

  await camViews.animateToView(camViews.camViews[0]);

  await viewer.setDirty(); // trigger a rerender.
  await snipper.downloadSnapshot("image.png", {
    waitForProgressive: true, // download anti-aliased image
  });
  await timeout(100);
  await camViews.animateToView(camViews.camViews[1]);

  await viewer.setDirty(); // trigger a rerender.
  await snipper.downloadSnapshot("image.png", {
    waitForProgressive: true, // download anti-aliased image
  });

  await timeout(100);

  await camViews.animateToView(camViews.camViews[3]);

  await viewer.setDirty(); // trigger a rerender.
  await snipper.downloadSnapshot("image.png", {
    waitForProgressive: true, // download anti-aliased image
  });
};

const initViewer = async (
  glb,
  json,
  primaryMetDmat,
  secondaryMetDmat,
  sideDia,
  diaDmat,
  sideDiaStarts,
  isSideDiaAvail,
  diaNameStarts,
  diaName,
  metal1NameStarts,
  metal2NameStarts,
  twoTone
) => {
  viewer = new ViewerApp({
    canvas: canvasElement,
    useRgbm: true,
  });

  let manager = await viewer.addPlugin(AssetManagerPlugin);

  await addBasePlugins(viewer);
  const snipper = await viewer.addPlugin(CanvasSnipperPlugin);
  // await viewer.addPlugin(FileTransferPlugin);

  // await viewer.addPlugin(MaterialConfiguratorPlugin);
  // await viewer.addPlugin(CustomMaterialConfiguratorPlugin);

  viewer.renderer.refreshPipeline();

  await viewer.scene.setEnvironment(
    await manager.importer.importSinglePath(
      "/gem_2.hdr"
    )
  );
  viewerInit = true;
  await resetModel(
    glb,
    json,
    primaryMetDmat,
    secondaryMetDmat,
    sideDia,
    diaDmat,
    sideDiaStarts,
    isSideDiaAvail,
    diaNameStarts,
    diaName,
    metal1NameStarts,
    metal2NameStarts,
    twoTone
  );
};

function useViewer({
  enable,
  json,
  glb,
  diaDmat,
  sideDia,
  secondaryMetDmat,
  diaNameStarts,
  diaName,
  sideDiaStarts,
  metal1NameStarts,
  twoTone,
  isSideDiaAvail,
  metal2NameStarts,
  sideDiaSame,
  primaryMetDmat,
}) {
  const canvasRef = useRef(null);



  useEffect(() => {
    if (canvasElement.parentElement !== canvasRef.current) {
      canvasRef.current.appendChild(canvasElement);
    }
    if (!viewer) {
      initViewer(
        glb,
        json,
        primaryMetDmat,
        secondaryMetDmat,
        sideDia,
        diaDmat,
        sideDiaStarts,
        isSideDiaAvail,
        diaNameStarts,
        diaName,
        metal1NameStarts,
        metal2NameStarts,
        twoTone
      );
    } else {
      viewer.enabled = true;
    }

    return () => {
      viewer.enabled = false;
      canvasElement.remove();
    };
  }, []);

  useEffect(() => {
    resetModel(
      glb,
      json,
      primaryMetDmat,
      secondaryMetDmat,
      sideDia,
      diaDmat,
      sideDiaStarts,
      isSideDiaAvail,
      diaNameStarts,
      diaName,
      metal1NameStarts,
      metal2NameStarts,
      twoTone
    );
  }, [glb, json]);

  useEffect(() => {
    resetMaterial(
      primaryMetDmat,
      secondaryMetDmat,
      sideDia,
      diaDmat,
      sideDiaStarts,
      isSideDiaAvail,
      diaNameStarts,
      diaName,
      metal1NameStarts,
      metal2NameStarts,
      twoTone
    );
  }, [
    primaryMetDmat,
    secondaryMetDmat,
    sideDia,
    diaDmat,
    sideDiaStarts,
    isSideDiaAvail,
    diaNameStarts,
    diaName,
    metal1NameStarts,
    metal2NameStarts,
    twoTone,
  ]);

  return canvasRef;
}

function loop({ }) { }

function App({
  enable,
  json,
  glb,
  diaDmat,
  secondaryMetDmat = undefined,
  sideDia = undefined,
  diaNameStarts = undefined,
  diaName = undefined,
  sideDiaStarts = undefined,
  metal1NameStarts,
  twoTone,
  isSideDiaAvail,
  metal2NameStarts = undefined,
  sideDiaSame = undefined,
  primaryMetDmat,
}) {
  const canvasRef = useViewer({
    enable,
    json,
    glb,
    diaDmat,
    sideDia,
    secondaryMetDmat,
    diaNameStarts,
    diaName,
    sideDiaStarts,
    metal1NameStarts,
    twoTone,
    isSideDiaAvail,
    metal2NameStarts,
    sideDiaSame,
    primaryMetDmat,
  });

  return (
    <>
      <div
        id="mcanvas_container"
        ref={canvasRef}
        style={{ width: "800px", height: "800px" }}
      ></div>
      <div id="mconfigurator"></div>
    </>
  );
}

export default App;
