import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker"; // install if needed
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  clearError,
  fetchUserProfile,
  updateUserProfile,
} from "../../../slices/userProfileSlice";

const DEFAULT_BANNER = require("@/assets/images/banner.jpg");
const DEFAULT_PROFILE = require("@/assets/images/persons/user.jpg"); // Placeholder profile image

const EditProfile = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch();

  const { profile, loading, error } = useSelector((state) => state.userProfile);
  const token = useSelector((state) => state.auth.accessToken);

  const [bannerImage, setBannerImage] = useState(DEFAULT_BANNER);
  const [profileImage, setProfileImage] = useState(DEFAULT_PROFILE);

  // Update profileImage and bannerImage when selected files change to show preview
  useEffect(() => {
    if (selectedProfileFile) {
      setProfileImage({ uri: selectedProfileFile.uri });
    }
  }, [selectedProfileFile]);

  useEffect(() => {
    if (selectedBannerFile) {
      setBannerImage({ uri: selectedBannerFile.uri });
    }
  }, [selectedBannerFile]);
  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [bioData, setBioData] = useState("");
  const [gender, setGender] = useState("");
  const [birthday, setBirthday] = useState(new Date());
  const [facebookLink, setFacebookLink] = useState("");
  const [instagramLink, setInstagramLink] = useState("");
  const [twitterLink, setTwitterLink] = useState("");
  const [selectedProfileFile, setSelectedProfileFile] = useState(null);
  const [selectedBannerFile, setSelectedBannerFile] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { user } = useAuth();
  const userId = user?.userId; // Get user ID from auth context


  console.log("EditProfile user object:", user);
  console.log("EditProfile user.id:", user?.userId);

  // Load profile data into local state when profile changes
  useEffect(() => {
    if (profile) {
      setFullName(profile?.name || "");
      setUserName(profile?.username || "");
      setBioData(profile?.bio || "");
      setGender(profile?.gender || "");
      setBirthday(profile?.dob ? new Date(profile.dob) : new Date());
      setFacebookLink(profile?.facebookLink || "");
      setInstagramLink(profile?.instagramLink || "");
      setTwitterLink(profile?.twitterLink || "");
      setProfileImage(
        profile.avatar
          ? { uri: profile.avatar }
          : DEFAULT_PROFILE
      );
      setBannerImage(
        profile.banner_image
          ? { uri: profile.banner_image }
          : DEFAULT_BANNER
      );
    }
  }, [profile]);

  // Fetch user profile on mount - assuming userId is available (hardcoded or from auth)
  useEffect(() => {
    const userId = user.userId; // Use user id from auth context
    if (userId) {
      dispatch(fetchUserProfile({ userId, token }));
    }
  }, [dispatch, user, token]);

  // Placeholder image picker handlers - to be replaced with actual image picker logic
  const chooseBannerPhoto = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert(
          "Permission required",
          "Access to media library is needed."
        );
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!pickerResult.canceled && pickerResult.assets?.length > 0) {
        const selectedAsset = pickerResult.assets[0];
        setSelectedBannerFile(selectedAsset);
        setBannerImage({ uri: selectedAsset.uri });
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick the banner image.");
    }
  };

  const chooseProfilePhoto = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert(
          "Permission required",
          "Access to media library is needed."
        );
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!pickerResult.canceled && pickerResult.assets?.length > 0) {
        const selectedAsset = pickerResult.assets[0];
        setSelectedProfileFile(selectedAsset);
        setProfileImage({ uri: selectedAsset.uri });
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick the profile image.");
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setBirthday(selectedDate);
    }
  };

  const onUpdate = () => {
    const userId = user?.userId; // Use user id from auth context
    if (!profile) {
      Alert.alert("Profile data not loaded");
      return;
    }

    const updateData = {};

    if (fullName !== (profile.name || "")) {
      updateData.name = fullName;
    }
    if (userName !== (profile.username || "")) {
      updateData.username = userName;
    }
    if (bioData !== (profile.bio || "")) {
      updateData.bio = bioData;
    }
    if (gender !== (profile.gender || "")) {
      updateData.gender = gender;
    }
    if (facebookLink !== (profile.facebookLink || "")) {
      updateData.facebookLink = facebookLink;
    }
    if (instagramLink !== (profile.instagramLink || "")) {
      updateData.instagramLink = instagramLink;
    }
    if (twitterLink !== (profile.twitterLink || "")) {
      updateData.twitterLink = twitterLink;
    }
    // Compare birthday dates carefully
    if (
      (birthday && profile.dob && birthday.toISOString() !== new Date(profile.dob).toISOString()) ||
      (birthday && !profile.dob) ||
      (!birthday && profile.dob)
    ) {
      updateData.dob = birthday;
    }

    if (Object.keys(updateData).length === 0 && !selectedProfileFile && !selectedBannerFile) {
      Alert.alert("No changes to update");
      return;
    }

    console.log("Sending update data:", updateData);
    dispatch(
      updateUserProfile({ userId, updateData, avatar: selectedProfileFile, banner_image: selectedBannerFile, token })
    )
      .unwrap()
      .then(() => {
        Alert.alert("Profile updated successfully");
      })
      .catch((err) => {
        Alert.alert("Update failed", err.toString());
      });
  };

  const onReset = () => {
    setFullName("");
    setUserName("");
    setBioData("");
    setGender("");
    setBirthday("");
    setFacebookLink("");
    setInstagramLink("");
    setTwitterLink("");
    setProfileImage(DEFAULT_PROFILE);
    setBannerImage(DEFAULT_BANNER);
    setSelectedProfileFile(null);
    setSelectedBannerFile(null);
    dispatch(clearError());
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Title bar with gradient background and back icon */}
      <LinearGradient
        colors={theme.colors.blueGradient}
        style={styles.titleBar}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <TouchableOpacity
          style={[
            styles.backIcon,
            {
              borderColor: theme.colors.text,
              backgroundColor: theme.colors.background,
            },
          ]}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.titleText, { color: theme.colors.text }]}>
          Edit Profile
        </Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Banner image with overlay shadow and choose banner button */}
        <View style={[styles.bannerContainer, { height: 200 }]}>
          {/* Banner Image */}
          <Image
            source={bannerImage}
            style={styles.bannerImage}
            resizeMode="cover"
          />

          {/* Overlay */}
          
          <View style={styles.bannerOverlay} />

          {/* Centered Choose Banner Button */}
          <TouchableOpacity
            style={[
              styles.chooseBannerButton,
              { borderColor: theme.colors.textLight },
            ]}
            onPress={chooseBannerPhoto}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.chooseBannerButtonText,
                { color: theme.colors.textLight },
              ]}
            >
              Choose a banner photo
            </Text>
          </TouchableOpacity>

          {/* Profile Image with smaller size */}
          <TouchableOpacity
            style={styles.profileImageWrapper}
            onPress={chooseProfilePhoto}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={theme.colors.blueGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.profileGradientBorder}
            >
              <View style={styles.profileImageInnerWrapper}>
                <Image source={profileImage} style={styles.profileImage} />
                <View style={styles.profileImageOverlay} />
              </View>

              {/* Plus icon overlaying the gradient border */}
              <View style={styles.plusIconWrapper}>
                <Ionicons name="add" size={24} color="white" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* White background box with input fields */}
        <View
          style={[
            styles.formContainer,
            { backgroundColor: theme.colors.Background },
          ]}
        >
          {/* Full Name */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Full name
            </Text>
            <View
              style={[
                styles.inputRow,
                { borderBottomColor: theme.colors.text },
              ]}
            >
              <TextInput
                style={[styles.textInput, { color: theme.colors.text }]}
                placeholder="Enter full name"
                placeholderTextColor={theme.colors.text}
                value={fullName}
                onChangeText={setFullName}
              />
              <TouchableOpacity>
                <MaterialIcons
                  name="edit"
                  size={20}
                  color={theme.colors.text}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* UserName */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              UserName
            </Text>
            <View
              style={[
                styles.inputRow,
                { borderBottomColor: theme.colors.text },
              ]}
            >
              <TextInput
                style={[styles.textInput, { color: theme.colors.textPrimary }]}
                placeholder="Enter username"
                placeholderTextColor={theme.colors.text}
                value={userName}
                onChangeText={setUserName}
              />
              <TouchableOpacity>
                <MaterialIcons
                  name="edit"
                  size={20}
                  color={theme.colors.text}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Biodata (full border bigger) */}
          <Text style={[styles.label, { color: theme.colors.textPrimary }]}>
              Biodata
            </Text>
          <View
            style={[
              styles.inputGroup,
              styles.bioDataGroup,
              { borderColor: theme.colors.text },
            ]}
          >
            
            <View>
              <TextInput
                style={[
                  styles.textInput,
                  styles.bioDataInput,
                  { color: theme.colors.text },
                ]}
                placeholder="Enter biodata"
                placeholderTextColor={theme.colors.text}
                value={bioData}
                onChangeText={setBioData}
                multiline
              />
              
            </View>
          </View>

          {/* Gender select option */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Gender
            </Text>
            <View
              style={[
                styles.inputRow,
                { borderBottomColor: theme.colors.text },
              ]}
            >
              <Picker
                selectedValue={gender}
                onValueChange={(itemValue) => setGender(itemValue)}
                style={{ color: theme.colors.text, flex: 1 }}
                dropdownIconColor={theme.colors.text}
              >
                <Picker.Item label="Select Gender" value="" />
                <Picker.Item label="Male" value="male" />
                <Picker.Item label="Female" value="female" />
              </Picker>
            </View>
          </View>

          {/* Birthday */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Birthday
            </Text>
            <TouchableOpacity
              style={[
                styles.inputRow,
                { borderBottomColor: theme.colors.text },
              ]}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={[styles.textInput, { color: theme.colors.text }]}>
                {birthday ? new Date(birthday).toDateString() : "Select date"}
              </Text>
              <MaterialIcons name="edit" size={20} color={theme.colors.text} />
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={birthday || new Date()}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
          </View>

          {/* Link account section */}
          <View style={styles.linkAccountSection}>
            <Text
              style={[styles.linkAccountTitle, { color: theme.colors.text }]}
            >
              Link account
            </Text>

            {/* Facebook */}
            <View
              style={[
                styles.inputRow,
                { borderBottomColor: theme.colors.text },
              ]}
            >
              <FontAwesome name="facebook" size={20} color="#3b5998" />
              <TextInput
                style={[styles.textInput, { color: theme.colors.text }]}
                placeholder="Facebook link"
                placeholderTextColor={theme.colors.text}
                value={facebookLink}
                onChangeText={setFacebookLink}
              />
              <TouchableOpacity>
                <MaterialIcons
                  name="link"
                  size={20}
                  color={theme.colors.text}
                />
              </TouchableOpacity>
            </View>

            {/* Instagram */}
            <View
              style={[
                styles.inputRow,
                { borderBottomColor: theme.colors.text },
              ]}
            >
              <FontAwesome name="instagram" size={20} color="#C13584" />
              <TextInput
                style={[styles.textInput, { color: theme.colors.text }]}
                placeholder="Instagram link"
                placeholderTextColor={theme.colors.text}
                value={instagramLink}
                onChangeText={setInstagramLink}
              />
              <TouchableOpacity>
                <MaterialIcons
                  name="link"
                  size={20}
                  color={theme.colors.icon}
                />
              </TouchableOpacity>
            </View>

            {/* Twitter */}
            <View
              style={[
                styles.inputRow,
                { borderBottomColor: theme.colors.border },
              ]}
            >
              <FontAwesome name="twitter" size={20} color="#1DA1F2" />
              <TextInput
                style={[styles.textInput, { color: theme.colors.text }]}
                placeholder="Twitter link"
                placeholderTextColor={theme.colors.text}
                value={twitterLink}
                onChangeText={setTwitterLink}
              />
              <TouchableOpacity>
                <MaterialIcons
                  name="link"
                  size={20}
                  color={theme.colors.text}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttonsRow}>
            <TouchableOpacity
              style={[styles.updateButton, { backgroundColor: "green" }]}
              onPress={onUpdate}
              disabled={loading}
            >
              <Text
                style={[styles.updateButtonText, { color: theme.colors.text }]}
              >
                {loading ? "Updating..." : "Update"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.resetButton, { borderColor: theme.colors.text }]}
              onPress={onReset}
              disabled={loading}
            >
              <Text
                style={[styles.resetButtonText, { color: theme.colors.text }]}
              >
                Reset
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingBottom: 15,
    paddingHorizontal: 15,
  },
  backIcon: {
    marginRight: 15,
    borderWidth: 1,
    borderRadius: 20,
    padding: 5,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  bannerContainer: {
    position: "relative",
    backgroundColor: "#000", // fallback background
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  chooseBannerButton: {
    position: "absolute",
    bottom: 120, // above profile image which sits at -80
    alignSelf: "center", // horizontally center
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: "transparent",
    zIndex: 10,
  },
  chooseBannerButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  profileImageWrapper: {
    position: "absolute",
    alignSelf: "center",
    bottom: -50, // overlaps banner
    zIndex: 15,
  },
  profileGradientBorder: {
    padding: 3,
    borderRadius: 76,
    position: "relative", // Make container relative for absolute positioning inside
  },
  profileImageInnerWrapper: {
    width: 100,
    height: 100,
    borderRadius: 100,
    backgroundColor: "#000", // black background inside border
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 100,
  },
  profileImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.2)", // subtle overlay
  },

  plusIconWrapper: {
    position: "absolute",
    bottom: 1, // Move outside the border slightly, adjust as needed
    right: -1,
    backgroundColor: "rgba(0,0,0,0.9)",
    borderRadius: 16,
    borderColor: "white",
    borderWidth: 1,
    padding: 2,
    zIndex: 20,
  },
  formContainer: {
    marginTop: 110,
    marginHorizontal: 15,
    borderRadius: 10,
    padding: 15,
  },
  inputGroup: {
    marginBottom: 15,
  },
  bioDataGroup: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
  },
  label: {
    fontWeight: "600",
    marginBottom: 5,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
  },
  textInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 5,
  },
  bioDataInput: {
    height: 80,
    textAlignVertical: "top",
  },
  linkAccountSection: {
    marginTop: 20,
  },
  linkAccountTitle: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 10,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  updateButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 10,
    alignItems: "center",
  },
  updateButtonText: {
    fontWeight: "700",
    fontSize: 16,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginLeft: 10,
    alignItems: "center",
  },
  resetButtonText: {
    fontWeight: "700",
    fontSize: 16,
  },
});
