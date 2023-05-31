import React from 'react'
import Viewer from '../component/Viewer2'

const Three_D = () => {
    return (
        <div>
            <Viewer
                json="https://demo-assets.pixotronics.com/clients/infiniteshowrooms/sceneExportAllViewerConfig.vjson"
                glb="https://demo-assets.pixotronics.com/clients/infiniteshowrooms/Grey_Example_Ring.glb"
                primaryMetDmat="https://demo-assets.pixotronics.com/clients/infiniteshowrooms/physical-material-Gold.pmat"
                enable={false}
                // secondaryMetDmat={"/silver-925.pmat"} 
                diaDmat="https://demo-assets.pixotronics.com/clients/infiniteshowrooms/diamond-material.dmat"
                diaNameStarts="Grey_Example_Diamond"
                diaName="Grey_Example_Diamond"
                metal1NameStarts="Grey_Example_Ring"
                // metal2NameStarts="Object"
                isSideDiaAvail={false}
                sideDiaSame={false}
                twoTone={false} />
        </div>
    )
}

export default Three_D