import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Button,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from '@react-navigation/native';

const TabTwoScreen = () => {
  const [imageUri, setImageUri] = useState("");
  const [imageType, setImageType] = useState("");
  const [imageName, setImageName] = useState("");
  const [caption, setCaption] = useState("");
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();

  const handleChooseImage = async () => {
    const cameraRollPerm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const cameraPerm = await ImagePicker.requestCameraPermissionsAsync();

    if (cameraRollPerm.status === "granted" && cameraPerm.status === "granted") {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled && result.assets && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
        setImageName("image");
        setImageType(result.assets[0].mimeType);
      }
    } else {
      alert("Camera and photo permissions are required to make this work!");
    }
  };

  const handleImageUpload = async () => {
    const url = "https://my-feed.tech786projects.com/utils/uploadImage";
    const form = new FormData();
    form.append("image", { uri: imageUri, type: imageType, name: imageName });

    const options = { method: "POST", body: form };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      return data.data.image;
    } catch (error) {
      console.error(error);
    }
  };

  const handlePost = async () => {
    setIsLoading(true);
    const image = await handleImageUpload();
    
    const url = "https://my-feed.tech786projects.com/post/addRecord";
    const options = {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ title, description: caption, image }).toString(),
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();

      if (data.status === "success") {
        setCaption("");
        setImageName("");
        setImageType("");
        setImageUri("");
        setTitle("");
        navigation.navigate('index', { refreshed: new Date().toISOString() });
      } else if (data.status === "error") {
        Alert.alert("Error", data.status.message);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred while posting");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={{backgroundColor: "white"}}>
      <View style={styles.cardContainer}>
        <View style={styles.profileContainer}>
          <Image
            source={require("../../assets/user.png")}
            style={styles.profileImage}
          />
          <Text style={styles.nameText}>Walter</Text>
        </View>
        <View style={styles.footer}>
          <View style={styles.footerItem}>
            <Text style={styles.footerItemTitle}>Joined</Text>
            <Text style={styles.footerItemValue}>2022</Text>
          </View>
          <View style={styles.footerItem}>
            <Text style={styles.footerItemTitle}>Likes</Text>
            <Text style={styles.footerItemValue}>866</Text>
          </View>
          <View style={styles.footerItem}>
            <Text style={styles.footerItemTitle}>Followers</Text>
            <Text style={styles.footerItemValue}>12</Text>
          </View>
        </View>
      </View>

      <View style={styles.addFeedContainer}>
        <Text style={styles.addHeading}>Post To Feed</Text>
        <View style={styles.uploadImageContainer}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.uploadedImage} />
          ) : null}
          <TouchableOpacity
            style={styles.imagePickerButton}
            onPress={handleChooseImage}
          >
            <Ionicons name="image-outline" size={30} color="white" />
            <Text style={styles.uploadImageText}>Upload Image</Text>
          </TouchableOpacity>
        </View>
        <Text style={{color: 'black', marginVertical: 5}}>Write a Title</Text>
        <TextInput
          style={styles.captionInput}
          placeholder="e.g: Mood"
          placeholderTextColor='black'
          value={title}
          onChangeText={setTitle}
        />
         <Text style={{color: 'black', marginVertical: 5}}>Write a Caption</Text>
        <TextInput
          style={styles.captionInput}
          placeholder="e.g: Feeling amazing today"
          placeholderTextColor='black'
          value={caption}
          onChangeText={setCaption}
        />
        {isLoading ? (
          <ActivityIndicator size="large" color="black" />
        ) : (
          <TouchableOpacity style={styles.postBtn} onPress={handlePost}>
            <Text style={styles.postBtnText}>Post to Feed</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#13326e",
    borderBottomEndRadius: 120,
    borderBottomStartRadius: 120,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingTop: 50,
    paddingBottom: 40,
  },
  uploadImageContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  imagePickerButton: {
    backgroundColor: "#EDF0F2",
    borderRadius: 25,
    padding: 10,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  uploadedImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  addHeading: {
    alignSelf: "center",
    fontSize: 25,
    fontWeight: "bold",
    color: "black",
    marginBottom: 15
  },
  profileContainer: {
    alignItems: "center",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    marginRight: 5,
  },
  nameText: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 5,
    color: "white",
  },
  professionText: {
    fontSize: 16,
    color: "white",
  },
  followButton: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 10,
  },
  footerItem: {
    alignItems: "center",
  },
  footerItemTitle: {
    fontSize: 14,
    color: "white",
  },
  footerItemValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#EDF0F2",
  },
  addFeedContainer: {
    padding: 20,
    paddingBottom: 350
  },
  uploadImageContainer: {
    alignItems: "center",
    marginBottom: 15,
    gap: 10
  },
  imagePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#13326e",
    borderRadius: 25,
    padding: 10,
  },
  uploadedImage: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 10,
  },
  uploadImageText: {
    marginLeft: 10,
    color: "white",
  },
  captionInput: {
    borderColor: "#13326e",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    color: "black",
    backgroundColor: "#EDF0F2",
  },
  postBtn: {
    backgroundColor: '#13326e',
    width: '30%',
    alignSelf: 'center',
    height: 40,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center'
  },
  postBtnText: {
    color: 'white'
  }
});

export default TabTwoScreen;
