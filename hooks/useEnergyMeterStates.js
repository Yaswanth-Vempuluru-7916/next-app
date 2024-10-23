//  hooks/useEnergyMeterStates
import { useRecoilState, useSetRecoilState } from 'recoil';
import { selectedMeterState, graphConfigState, fullScreenCardState, shouldFetchDataState } from '../lib/atoms';

export function useEnergyMeterStates() {
  const [selectedMeter, setSelectedMeter] = useRecoilState(selectedMeterState);
  const [graphConfig, setGraphConfig] = useRecoilState(graphConfigState);
  const [fullScreenCard, setFullScreenCard] = useRecoilState(fullScreenCardState);
  const setShouldFetchData = useSetRecoilState(shouldFetchDataState);

  const setSelectedMeterAndFetch = (meter) => {
    setSelectedMeter(meter);
    setShouldFetchData(true);
  };

  return {
    selectedMeter,
    setSelectedMeter: setSelectedMeterAndFetch,
    graphConfig,
    setGraphConfig,
    fullScreenCard,
    setFullScreenCard
  };
}