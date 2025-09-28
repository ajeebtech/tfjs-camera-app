import React, { useEffect, useState } from 'react';
import { Button, View, StyleSheet, Dimensions } from 'react-native';
import { useCameraPermissions } from 'expo-camera';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

import CustomTensorCamera from './CustomTensorCamera';
import { PredictionList } from './PredictionList';
import { LoadingView } from './LoadingView';

export default function App() {
  const [tfReady, setTfReady] = useState(false);
  const [model, setModel] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [permission, requestPermission] = useCameraPermissions();

  const windowWidth = Dimensions.get('window').width;

  // Load TensorFlow.js and MobileNet model
  useEffect(() => {
    async function loadModel() {
      await tf.ready();
      const loadedModel = await mobilenet.load();
      setModel(loadedModel);
      setTfReady(true);
    }
    loadModel();
  }, []);

  // Loading / permission handling
  if (!permission) {
    return <LoadingView message="Checking camera permissions..." />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Button title="Grant Camera Permission" onPress={requestPermission} />
      </View>
    );
  }

  if (!tfReady || !model) {
    return <LoadingView message="Loading TensorFlow model..." />;
  }

  // Main camera + prediction view
  return (
    <View style={styles.container}>
      <PredictionList predictions={predictions} />
      <CustomTensorCamera
        width={windowWidth}
        onReady={(images) => {
          const loop = async () => {
            const nextImageTensor = images.next().value;
            if (nextImageTensor) {
              try {
                const results = await model.classify(nextImageTensor);
                setPredictions(results);
              } catch (err) {
                console.warn('Classification error:', err);
              }
            }
            requestAnimationFrame(loop);
          };
          loop();
        }}
        autorender
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});