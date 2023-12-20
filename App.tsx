// React Native code

import React, {useState} from 'react';
import ImagePicker from 'react-native-image-crop-picker';

import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';

const App = () => {
  const [question, setQuestion] = useState('');
  const [predictedAnswer, setPredictedAnswer] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const handlePrediction = async () => {
    console.log(
      '🚀 ~ file: App.tsx:19 ~ App ~ question:',
      JSON.stringify({imageUrl, question}),
    );

    try {
      const response = await fetch('http://10.0.2.2:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({imageUrl, question}),
      });

      const data = await response.json();
      if (data.predictedAnswer) {
        setPredictedAnswer(data.predictedAnswer);
      } else if (data.error) {
        Alert.alert('Error', data.error);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };
  // Function to handle image selection from gallery
  const handleImageSelection = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
        mediaType: 'photo', // Set the media type to photo
      });

      handleUpData(image.path);
    } catch (error) {
      console.log('Image picker error:', error);
    }
  };

  const handleUpData = photoPath => {
    const data = new FormData();
    data.append('file', {
      uri: photoPath,
      type: 'image/jpg', // Set the type accordingly
      name: photoPath.split('/').pop(), // Extracting image name from path
    });
    data.append('upload_preset', 'movie_recommend');
    data.append('cloud_name', 'dvpt9evqt');

    fetch('https://api.cloudinary.com/v1_1/dvpt9evqt/image/upload', {
      method: 'POST',
      body: data,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(res => res.json())
      .then(data => {
        setImageUrl(data.url);
        console.log(data);
      })
      .catch(error => {
        Alert.alert('Error While Uploading');
      });
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.imageButton}
        onPress={handleImageSelection}>
        {/* Show selected image or default text */}
        {imageUrl ? (
          <Image source={{uri: imageUrl}} style={styles.image} />
        ) : (
          <Text style={{color: 'black'}}>Select Image</Text>
        )}
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Enter question"
        placeholderTextColor="#000"
        value={question}
        onChangeText={text => setQuestion(text)}
      />
      <Button title="Predict Answer" onPress={handlePrediction} />
      <Text>Predicted Answer: {predictedAnswer}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    color: 'black',
    marginBottom: 20,
    width: '100%',
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  imageButton: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    color: 'black',
  },
  submitButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});
export default App;
