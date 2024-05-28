import { ResultStatistic } from "db://shared-components/game/result-statistic/scripts/components/result-statistic";
import { _decorator, Component, Label } from "cc";
const { ccclass, property } = _decorator;
import gc from "@sg/game-client-base";

@ccclass("CoinTossResultStatistic")
export class CoinTossResultStatistic extends ResultStatistic {
    @property({ override: true })
    supportStatisticKeys = "head,tail";

    protected generateStatisticalData(histories: gc.RoundHistories.RoundHistory[]) {
        //console.log(JSON.stringify(histories));
        const statisticCount = histories.reduce((result, history) => {
            this.statisticKeys?.forEach((key) => {
                if (history.result[key]) {
                    result[key] = (result[key] || 0) + 1;
                }
            });
            return result;
        }, {});
        const statisticPercent = Object.keys(statisticCount).reduce((result, key) => {
            result[key] = `${Math.round((statisticCount[key] / histories.length) * 100)}%`;
            return result;
        }, {});

        return statisticPercent;
    }
}
