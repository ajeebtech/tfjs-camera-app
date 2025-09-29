import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Button, Text } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { cameraWithTensors } from '@tensorflow/tfjs-react-native';

const TensorCamera = cameraWithTensors(CameraView);

export default function CameraWithTensorStream() {
  const [permission, requestPermission] = useCameraPermissions();
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    if (permission?.granted) {
      setHasPermission(true);
    }
  }, [permission]);

  if (!permission) return <View />;

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'white' }}>No camera permission</Text>
        <Button title="Grant permission" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TensorCamera
        style={StyleSheet.absoluteFill}
        type="back"
        autorender={true}
        resizeHeight={200}
        resizeWidth={152}
        resizeDepth={3}
        ratio="16:9" // Hardcoded ratio compatible with most devices
        onReady={(images, updatePreview, gl) => {
          const loop = async () => {
            const nextImageTensor = images.next().value;
            if (nextImageTensor) nextImageTensor.dispose();
            requestAnimationFrame(loop);
          };
          loop();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});