import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ScrollView as RNScrollView,
} from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import { Feather, Foundation } from '@expo/vector-icons';
import ScreenWrapper from '../../../components/ScreeenWrapper';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCommunities } from '../../slices/communitySlice';

const windowWidth = Dimensions.get('window').width;

export default function HomeScreen() {
  const { theme } = useTheme();
  const dispatch = useDispatch();

  const communities = useSelector((state) => state?.community?.communities || []);
  const communityNames = React.useMemo(() => {
    if (!Array.isArray(communities)) return [];
    return communities.map((c) => c.name);
  }, [communities]);

  const [searchText, setSearchText] = useState('');
  const [selectedSeekerOptions, setSelectedSeekerOptions] = useState([]);
  const [selectedListenerOptions, setSelectedListenerOptions] = useState([]);

  useEffect(() => {
    dispatch(fetchCommunities());
  }, [dispatch]);

  const toggleOption = (option, selectedOptions, setOptions) => {
    setOptions((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );
  };

  const renderOptionButton = (option, selected, onPress, iconName, iconColor, IconComponent) => (
    <TouchableOpacity
      key={option}
      style={[
        styles.optionButton,
        selected && styles.optionButtonSelected,
        {
          backgroundColor: selected ? theme.colors.primary : 'transparent',
          borderColor: selected ? theme.colors.primary : 'black',
          flexDirection: IconComponent === Feather ? 'row-reverse' : 'row',
        },
      ]}
      onPress={() => onPress(option)}
    >
      <IconComponent name={iconName} size={20} color={selected ? 'white' : iconColor} />
      <Text style={[styles.optionButtonText, { color: selected ? 'white' : 'black' }]}>
        {option}
      </Text>
    </TouchableOpacity>
  );

  const renderPostItem = ({ item }) => (
    <View style={[styles.postCard, { backgroundColor: theme.colors.cardBackground }]}>
      <Text style={{ color: theme.colors.text }}>{item}</Text>
    </View>
  );

  const posts = Array.from({ length: 9 }, (_, i) => `Post ${i + 1}`);

  return (
    <View padding={4} bg={theme.colors.background} style={styles.content}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View
          style={[
            styles.searchBarContainer,
            { borderColor: theme.colors.primary },
          ]}
        >
          <Feather
            name="search"
            size={20}
            style={styles.searchIcon}
          />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Search"
            placeholderTextColor={theme.colors.textSecondary}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        <Text style={[styles.readyText, { color: theme.colors.text }]}>
          Ready to improve your day?
        </Text>

        {/* Seeker and Listener Boxes */}
        <View style={styles.boxesContainer}>
          <View style={[styles.box, styles.seekerBox]}>
            <View
              style={[
                styles.boxTitleContainer,
                { backgroundColor: theme.colors.primary , borderColor: 'black', borderWidth: 3},
              ]}
            >
              <Text style={styles.seekerTitle}>Seeker</Text>
              <View
                style={[styles.boxTitleBorder, { borderColor: 'black' }]}
              />
            </View>
            <Text style={styles.boxSubtitle}>Speak based on your interest</Text>
            <RNScrollView showsVerticalScrollIndicator={true} style={{ maxHeight: 200 }} nestedScrollEnabled={true}>
              <View style={styles.optionsContainerVertical}>
                {communityNames.map((option) =>
                  renderOptionButton(
                    option,
                    selectedSeekerOptions.includes(option),
                    (opt) =>
                      toggleOption(opt, selectedSeekerOptions, setSelectedSeekerOptions),
                    'mic',
                    'black',
                    Feather
                  )
                )}
              </View>
            </RNScrollView>
          </View>

          <View style={[styles.box, styles.listenerBox]}>
            <View style={[styles.boxTitleContainer, { backgroundColor: 'black' , borderColor: "blue" , borderWidth: 3}]}>
              <Text style={[styles.listenerTitle, { color: theme.colors.primary }]}>Listener</Text>
              <View
                style={[styles.boxTitleBorder, { borderColor: theme.colors.primaryGradientStart }]}
              />
            </View>
            <Text style={[styles.boxSubtitle, { color: theme.colors.text }]}>
              Listen based on your interest
            </Text>
            <RNScrollView showsVerticalScrollIndicator={true} style={{ maxHeight: 200 }} nestedScrollEnabled={true}>
              <View style={styles.optionsContainerVertical}>
                {communityNames.map((option) =>
                  renderOptionButton(
                    option,
                    selectedListenerOptions.includes(option),
                    (opt) =>
                      toggleOption(opt, selectedListenerOptions, setSelectedListenerOptions),
                    'play-circle',
                    theme.colors.primary,
                    Foundation
                  )
                )}
              </View>
            </RNScrollView>
          </View>
        </View>

        {/* Latest Post Row */}
        <View style={styles.latestPostRow}>
          <Text style={[styles.latestPostText, { color: theme.colors.text }]}>
            Check Latest post
          </Text>
          <TouchableOpacity>
            <Text style={[styles.viewAllText, { color: theme.colors.primary }]}>View all</Text>
          </TouchableOpacity>
        </View>

        {/* Posts Grid */}
        <FlatList
          data={posts}
          renderItem={renderPostItem}
          keyExtractor={(item) => item}
          numColumns={3}
          contentContainerStyle={styles.postsGrid}
          scrollEnabled={false} // Important inside ScrollView
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 16,
    paddingVertical: 20,
    paddingTop: 30,
  },
 searchBarContainer: {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  borderWidth: 2,
  borderRadius: 25,
  width: '80%',
  paddingHorizontal: 15,
  marginBottom: 15,
  alignSelf: 'center', // <-- This centers the container itself
},
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  readyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  boxesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  box: {
    flex: 1,
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 5,
  },
  seekerBox: {
   
    shadowColor: '#d3d3d3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  listenerBox: {
    shadowColor: '#d3d3d3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
 
  boxTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 5,
    padding: 5,
  },
  seekerTitle: {
    flex: 1,
    fontWeight: '700',
    fontSize: 18,
    color: 'white',
    justifyContent: 'center',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  listenerTitle: {
    flex: 1,
    fontWeight: '700',
    fontSize: 18,
    justifyContent: 'center',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  boxTitleBorder: {
    width: 4,
    height: 24,
    borderWidth: 1,
    marginLeft: 10,
  },
  boxSubtitle: {
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
    justifyContent: 'center',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  optionsContainerVertical: {
    flexDirection: 'column',
    flexWrap: 'nowrap',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 5,
  },
  optionButtonSelected: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  optionButtonText: {
    marginLeft: 6,
    fontWeight: '600',
  },
  latestPostRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
    marginBottom: 10,
  },
  latestPostText: {
    fontSize: 16,
    fontWeight: '600',
  },
  viewAllText: {
    fontSize: 16,
    fontWeight: '600',
  },
  postsGrid: {
    paddingBottom: 40,
  },
  postCard: {
    flex: 1,
    margin: 5,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
});
