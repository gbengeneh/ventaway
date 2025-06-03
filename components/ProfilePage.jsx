import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ScrollView,
  Platform,
} from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@/context/UserContext";
import { Ionicons, MaterialIcons, Entypo } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import ProfileDropdown from "./ProfileDropdown";

const windowWidth = Dimensions.get("window").width;
const FILTERS = ["All posts", "Videos", "Audio", "Pictures"];

const ProfilePage = ({ navigation }) => {
  const { theme } = useTheme();
  const { userProfile } = useUser();
  const router = useRouter();

  const [activeFilter, setActiveFilter] = useState("All posts");
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    const timestamp = Date.now();
    const newPosts = Array.from({ length: 9 }, (_, i) => ({
      id: `post-${page}-${i}-${timestamp}-${Math.random()}`,
      title: `Post ${page}-${i}`,
      image: userProfile?.avatar || "https://i.pravatar.cc/150",
    }));

    if (page === 1) {
      setPosts(newPosts);
    } else {
      setPosts((prev) => [...prev, ...newPosts]);
    }
    setLoadingMore(false);
  }, [activeFilter, page]);

  const loadMorePosts = () => {
    if (!loadingMore) {
      setLoadingMore(true);
      setPage((prev) => prev + 1);
    }
  };

  const renderPostItem = ({ item }) => (
    <View style={[styles.postCard, { backgroundColor: theme.colors.cardBackground }]}>
      <Image source={{ uri: item.image }} style={styles.postImage} />
      <Text style={[styles.postTitle, { color: theme.colors.text }]} numberOfLines={1}>
        {item.title}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <LinearGradient
        colors={theme.colors.blueGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerContainer}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[
              styles.backButton,
              {
                borderColor: theme.colors.text,
                backgroundColor: theme.colors.background,
              },
            ]}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {userProfile?.name || "User"}
          </Text>
          <TouchableOpacity
            onPress={() => setDropdownVisible(!dropdownVisible)}
            style={styles.dropdownToggle}
          >
            <Ionicons name="ellipsis-vertical" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <ProfileDropdown visible={dropdownVisible} onClose={() => setDropdownVisible(false)} />
        </View>
      </LinearGradient>

      <ScrollView>
        <Image
          source={
            userProfile?.banner_image
              ? { uri: userProfile.banner_image }
              : require("@/assets/images/banner.jpg")
          }
          style={styles.bannerImage}
          resizeMode="cover"
        />

        <View style={styles.profileImageWrapper}>
          <Image
            source={
              userProfile?.avatar
                ? { uri: userProfile.avatar }
                : require("@/assets/images/persons/user.jpg")
            }
            style={styles.profileImage}
          />
        </View>

        <View style={styles.usernameContainer}>
          <Text style={[styles.usernameText, { color: theme.colors.text }]}>
            @{userProfile?.username || "username"}
          </Text>
        </View>

        <View style={styles.countsContainer}>
          {[
            { label: "Following", count: userProfile?.following?.length || 0 },
            { label: "Followers", count: userProfile?.followers?.length || 0 },
            { label: "Community", count: userProfile?.communityCount || 0 },
          ].map(({ label, count }) => (
            <View style={styles.countItem} key={label}>
              <Text style={[styles.countNumber, { color: theme.colors.text }]}>{count}</Text>
              <Text style={[styles.countLabel, { color: theme.colors.text }]}>{label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.interestsContainer}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Interests
          </Text>
          <Text style={[styles.interestsText, { color: theme.colors.textSecondary }]}>
            Interests will be implemented later.
          </Text>
        </View>

        <View style={styles.buttonsRow}>
          <TouchableOpacity style={[styles.button, { borderColor: "green" }]}>
            <Ionicons name="checkmark-circle" size={20} color="green" />
            <Text style={styles.buttonText}>Get Verified</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { borderColor: "blue" }]}
            onPress={() => router.push("/(main)/settings/edit_profile")}
          >
            <MaterialIcons name="edit" size={20} color="blue" />
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { borderColor: "#333" }]}>
            <Entypo name="share" size={20} color="black" />
            <Text style={styles.buttonText}>Share Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.filterTabsContainer, { backgroundColor: theme.colors.cardBackground }]}>
          {FILTERS.map((filter) => {
            const isActive = filter === activeFilter;
            return (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterTab,
                  isActive && { backgroundColor: theme.colors.primaryGradientStart },
                ]}
                onPress={() => {
                  setActiveFilter(filter);
                  setPage(1);
                }}
              >
                <Text style={[styles.filterTabText, isActive && { color: "white" }]}>
                  {filter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <FlatList
          data={posts}
          renderItem={renderPostItem}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={styles.postsGrid}
          onEndReached={loadMorePosts}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loadingMore ? (
            <Text style={{ textAlign: "center", padding: 10 }}>Loading...</Text>
          ) : null}
          scrollEnabled={false}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 1,
  },
  headerContainer: {
    paddingTop: Platform.OS === "ios" ? 50 : 30,
    paddingBottom: 15,
    paddingHorizontal: 15,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 15,
    borderWidth: 1,
    borderRadius: 20,
    padding: 5,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
  },
  dropdownToggle: {
    padding: 5,
    borderRadius: 20,
  },
  bannerImage: {
    width: "100%",
    height: 200,
  },
  profileImageWrapper: {
    alignItems: "center",
    marginTop: -40,
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#fff",
    backgroundColor: "#ccc",
  },
  usernameContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  usernameText: {
    fontSize: 18,
    fontWeight: "600",
  },
  countsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  countItem: {
    alignItems: "center",
  },
  countNumber: {
    fontSize: 18,
    fontWeight: "bold",
  },
  countLabel: {
    fontSize: 14,
  },
  interestsContainer: {
    marginTop: 20,
    marginHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 5,
  },
  interestsText: {
    fontSize: 14,
    fontStyle: "italic",
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    marginHorizontal: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  buttonText: {
    marginLeft: 5,
    fontSize: 14,
  },
  filterTabsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    marginVertical: 10,
  },
  filterTab: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 15,
  },
  filterTabText: {
    fontSize: 14,
  },
  postsGrid: {
    paddingHorizontal: 10,
    marginBottom: 30,
  },
  postCard: {
    flex: 1 / 3,
    margin: 5,
    borderRadius: 8,
    overflow: "hidden",
  },
  postImage: {
    width: "100%",
    height: 100,
  },
  postTitle: {
    fontSize: 12,
    padding: 5,
  },
});

export default ProfilePage;
