import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from '@react-navigation/native';

const commentsData = [
  {
    username: "Jane Doe",
    text: "Wow 😍",
    avatar: require("../../assets/user.png"),
  },
  {
    username: "John Smith",
    text: "Loving It",
    avatar: require("../../assets/user.png"),
  },
  // Add more comments as needed
];

const TabOneScreen = ({
  username,
  children,
  likes,
  comments,
  avatar,
  postImage,
  title,
  onDelete,
  postId,
  fetchPosts,
}) => {
  const [showComments, setShowComments] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const toggleComments = () => setShowComments(!showComments);
  const toggleDropdown = () => setShowDropdown(!showDropdown);

  async function deletePost(id) {
    const url = 'https://my-feed.tech786projects.com/post/deleteRecord';
    const options = {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ recordId: id })
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      console.log(data);
      if (data.status === "success") {
        fetchPosts();
      }
    } catch (error) {
      console.error(error);
    }
  }

  const toggleLike = () => setIsLiked(!isLiked);
  const handleDelete = async (id) => {
    Alert.alert("Are you sure?", "Do you want to delete this post ? ", [
      { text: "Yes", onPress: () => deletePost(id) },
      { text: "No", style: "cancel" }
    ])
  }
  return (
    <View style={styles.post}>
      <View style={styles.postHeader}>
        <Image source={avatar} style={styles.avatar} />
        <Text style={styles.username}>{username}</Text>
      </View>
      <View style={styles.postContent}>
        <Text style={styles.postTitle}>{title}</Text>
        <Text style={styles.postText}>{children}</Text>
        <Image source={postImage} style={styles.postImage} resizeMode="cover" />
        <View style={styles.postFooter}>
          <TouchableOpacity onPress={toggleLike}>
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={24}
              color={isLiked ? "red" : "black"}
            />
            <Text>{likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleComments}>
            <Ionicons name="chatbubble-outline" size={24} color="black" />
            <Text style={styles.commentCount}>{comments}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { handleDelete(postId) }}>
            <Ionicons name="trash-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
        {showComments && (
          <View style={styles.commentsSection}>
            {commentsData.map((comment, index) => (
              <View key={index} style={styles.comment}>
                <Image source={comment.avatar} style={styles.commentAvatar} />
                <Text style={styles.commentText}>
                  <Text style={styles.commentUsername}>{comment.username}</Text>
                  : {comment.text}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

export default function App() {
  const [data, setData] = useState([]);

  const getFeeds = async () => {
    const url = "https://my-feed.tech786projects.com/post/getAll";
    const options = {
      method: "GET",
      headers: { "content-type": "application/x-www-form-urlencoded" },
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      if (data.status === "success") {
        setData(data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };


  useFocusEffect(
    useCallback(() => {
      getFeeds();

      // Optional: Return a callback to cancel any outgoing requests
      // This is not necessary if your fetch call doesn't support cancellation
      return () => {
        // Cancel fetch operation if applicable
      };
    }, [])
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.feedHeader}>
        <Image style={styles.logo} source={require("../../assets/logo.png")} />
      </View>
      {data?.map((feed, index) => {
        return (
          <TabOneScreen
            key={index} // It's important to provide a unique key when rendering a list
            username="Audrey Peck"
            likes="12k"
            comments="2"
            avatar={require("../../assets/user.png")}
            postImage={{ uri: feed.image }}
            title={feed.title}
            postId={feed._id}
            fetchPosts={getFeeds}
          >
            {feed.description}
          </TabOneScreen>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#13326e",
  },
  logo: {
    width: '30%',
    height: '39%',
    marginTop: '3%'

  },
  feedHeader: {
    height: 140,
    alignItems: "center",
    backgroundColor: "#13326e",
    width: '100%',
    justifyContent: 'center'
  },
  myFeedHeading: {
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
  },
  postContent: {
    paddingHorizontal: 20,
  },
  post: {
    backgroundColor: "#fff",
    marginBottom: 1,
    borderBottomColor: "black",
    borderBottomWidth: 1,
    paddingBottom: 20,
  },
  commentCount: {
    marginLeft: 8,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontWeight: "bold",
  },
  postText: {
    padding: 10,
  },
  postTitle: {
    padding: 10,
    fontWeight: 'bold',
    fontSize: 20
  },
  postImage: {
    width: "100%",
    height: 350,
  },
  postFooter: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  commentsSection: {
    marginTop: 10,
  },
  comment: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  commentAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  commentUsername: {
    fontWeight: "bold",
  },
  commentText: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  closeComments: {
    alignSelf: "flex-end",
    marginTop: 10,
  },
  dropdownMenu: {
    position: "absolute",
    right: 10,
    top: 160,
    backgroundColor: "white",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  dropdownMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  dropdownMenuText: {
    marginLeft: 10,
  },
});
