import { _decorator, Component, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Dissolve')
export class Dissolve extends Component {
    start() {
        const sp = this.getComponent(Sprite);
        let threshold = 0;
        this.schedule((dt: number) => {
            sp.material.setProperty("dissolveThreshold", threshold);
            if (threshold >= 1) {
                this.unscheduleAllCallbacks();
            }
            threshold = Math.min(threshold + dt / 2, 1);
        });
    }
}


