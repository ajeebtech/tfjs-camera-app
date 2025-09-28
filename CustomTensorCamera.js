import React, { useMemo } from 'react';
import { Camera } from 'expo-camera';
import { cameraWithTensors } from '@tensorflow/tfjs-react-native';
import { View } from 'react-native';

// Wrap the Camera properly
const TensorCamera = cameraWithTensors(Camera);

export default function CustomTensorCamera({ style, width, ...props }) {
  const sizeStyle = useMemo(() => {
    const ratio = width / 1080; // Base texture width
    return {
      width: 1080 * ratio,
      height: 1920 * ratio,
    };
  }, [width]);

  if (!TensorCamera) {
    // safeguard: sometimes cameraWithTensors returns undefined if Camera isn't ready
    return <View style={[style, sizeStyle]} />;
  }

  return (
    <TensorCamera
      {...props}
      style={[style, sizeStyle]}
      cameraTextureWidth={1080}
      cameraTextureHeight={1920}
      resizeWidth={152}
      resizeHeight={152 * (1920 / 1080)}
      resizeDepth={3}
      type="back"
    />
  );
}