interface Message<T> {
  name: string;
  data: T;
}

interface ToggleFeatureMessageData {
  featureKey: string;
  featureState: boolean;
}