// App.tsx
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";

// =============================
// TYPES
// Defines what a dish/menu item looks like
// =============================
type MenuItem = {
  id: string;
  name: string;
  description: string;
  category: "Starters" | "Mains" | "Dessert" | "Drinks";
  price: number;
};

// =============================
// HOME SCREEN
// Displays all menu items
// =============================
function HomeScreen({
  menuItems,
  onRemoveItem,
}: {
  menuItems: MenuItem[];
  onRemoveItem: (id: string) => void;
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tonight's Dining Selection</Text>
      <Text style={styles.totalCount}>Total menu items: {menuItems.length}</Text>

      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemCategory}>{item.category}</Text>
              <Text style={styles.itemPrice}>R {item.price.toFixed(2)}</Text>
              <Text style={styles.itemDescription}>{item.description}</Text>
            </View>

            {/* Delete button for removing items */}
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() =>
                Alert.alert(
                  "Remove Dish",
                  `Are you sure you want to delete "${item.name}"?`,
                  [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Delete",
                      style: "destructive",
                      onPress: () => onRemoveItem(item.id),
                    },
                  ]
                )
              }
            >
              <Text style={{ color: "#C7A247", fontWeight: "bold" }}>X</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No dishes added yet.</Text>
        }
      />
    </View>
  );
}

// =============================
// ADD DISH SCREEN
// Where users can add new dishes
// =============================
function AddDishScreen({ onAddDish }: { onAddDish: (dish: MenuItem) => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<MenuItem["category"]>("Starters");
  const [priceText, setPriceText] = useState("");

  // Handles saving a new dish
  const handleAdd = () => {
    const price = Number(priceText);
    if (!name.trim() || isNaN(price) || price <= 0) {
      Alert.alert("Please fill in all fields correctly.");
      return;
    }

    const newDish: MenuItem = {
      id: Date.now().toString(),
      name: name.trim(),
      description: description.trim(),
      category,
      price,
    };

    onAddDish(newDish);
    setName("");
    setDescription("");
    setCategory("Starters");
    setPriceText("");
    Alert.alert("Dish added successfully!");
  };

  const categories: MenuItem["category"][] = [
    "Starters",
    "Mains",
    "Dessert",
    "Drinks",
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Add New Dish</Text>

        {/* Dish name */}
        <Text style={styles.label}>Dish Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Grilled Salmon"
          placeholderTextColor="#A97F2E"
          value={name}
          onChangeText={setName}
        />

        {/* Category selector */}
        <Text style={styles.label}>Select Category</Text>
        <View style={styles.categoryButtons}>
          {categories.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.categoryButton,
                category === option && styles.selectedCategoryButton,
              ]}
              onPress={() => setCategory(option)}
            >
              <Text
                style={
                  category === option
                    ? styles.selectedCategoryText
                    : styles.categoryText
                }
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Price input */}
        <Text style={styles.label}>Price (R)</Text>
        <TextInput
          style={styles.input}
          placeholder="0.00"
          placeholderTextColor="#A97F2E"
          keyboardType="decimal-pad"
          value={priceText}
          onChangeText={setPriceText}
        />

        {/* Description input */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          multiline
          placeholder="Short description of the dish"
          placeholderTextColor="#A97F2E"
          value={description}
          onChangeText={setDescription}
        />

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => {
              setName("");
              setDescription("");
              setCategory("Starters");
              setPriceText("");
            }}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.saveButton]}
            onPress={handleAdd}
          >
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// =============================
// FILTER SCREEN
// Allows filtering menu items by category
// =============================
function FilterScreen({ menuItems }: { menuItems: MenuItem[] }) {
  const [selectedCategory, setSelectedCategory] = useState<
    MenuItem["category"] | "All"
  >("All");

  // Filters the list based on selected category
  const filteredItems = useMemo(() => {
    if (selectedCategory === "All") return menuItems;
    return menuItems.filter((item) => item.category === selectedCategory);
  }, [menuItems, selectedCategory]);

  const filterOptions: (MenuItem["category"] | "All")[] = [
    "All",
    "Starters",
    "Mains",
    "Dessert",
    "Drinks",
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filter by Category</Text>

      {/* Filter buttons */}
      <View style={styles.filterRow}>
        {filterOptions.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[
              styles.pill,
              selectedCategory === opt && styles.pillActive,
            ]}
            onPress={() => setSelectedCategory(opt)}
          >
            <Text
              style={[
                styles.pillText,
                selectedCategory === opt && { color: "#fff" },
              ]}
            >
              {opt}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Filtered results */}
      {filteredItems.length === 0 ? (
        <Text style={styles.emptyText}>No dishes found for this category.</Text>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.itemCard}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemCategory}>{item.category}</Text>
              <Text style={styles.itemPrice}>R {item.price.toFixed(2)}</Text>
              <Text style={styles.itemDescription}>{item.description}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

// =============================
// MAIN APP
// Combines all tabs (Menu + Add + Filter)
// =============================
const Tab = createBottomTabNavigator();

export default function App() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const addMenuItem = (item: MenuItem) => {
    setMenuItems((prev) => [item, ...prev]);
  };

  const removeMenuItem = (id: string) => {
    setMenuItems((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: { backgroundColor: "#F8D7DA" },
          headerStyle: { backgroundColor: "#F8D7DA" },
          headerTintColor: "#5A4309",
          tabBarActiveTintColor: "#C7A247",
          tabBarInactiveTintColor: "#8E6C2B",
        }}
      >
        <Tab.Screen name="Menu">
          {() => <HomeScreen menuItems={menuItems} onRemoveItem={removeMenuItem} />}
        </Tab.Screen>

        <Tab.Screen name="Add">
          {() => <AddDishScreen onAddDish={addMenuItem} />}
        </Tab.Screen>

        <Tab.Screen name="Filter">
          {() => <FilterScreen menuItems={menuItems} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// =============================
// STYLES
// =============================
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#FCE4EC",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#5A4309",
    textAlign: "center",
    marginBottom: 12,
  },
  totalCount: {
    color: "#C7A247",
    textAlign: "center",
    marginBottom: 12,
    fontSize: 14,
  },
  itemCard: {
    flexDirection: "row",
    backgroundColor: "#FFF8F0",
    borderColor: "#C7A247",
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    alignItems: "flex-start",
  },
  itemName: { color: "#5A4309", fontSize: 18, fontWeight: "bold" },
  itemCategory: { color: "#8E6C2B", marginTop: 4 },
  itemPrice: { color: "#A97F2E", marginTop: 4, fontWeight: "700" },
  itemDescription: { color: "#6B4E1D", marginTop: 6 },
  emptyText: { textAlign: "center", color: "#8E6C2B", marginTop: 40 },

  label: { color: "#5A4309", fontWeight: "bold", marginBottom: 6, marginTop: 6 },
  input: {
    backgroundColor: "#FFF8F0",
    color: "#5A4309",
    borderColor: "#C7A247",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  categoryButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#C7A247",
    backgroundColor: "#FFF8F0",
  },
  selectedCategoryButton: { backgroundColor: "#C7A247" },
  categoryText: { color: "#C7A247" },
  selectedCategoryText: { color: "#FFF8F0", fontWeight: "bold" },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 6,
  },
  cancelButton: { backgroundColor: "#FFF8F0" },
  saveButton: { backgroundColor: "#C7A247" },
  cancelText: { color: "#5A4309", fontWeight: "bold" },
  saveText: { color: "white", fontWeight: "bold" },
  deleteBtn: {
    height: 36,
    width: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#C7A247",
    marginLeft: 8,
  },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#C7A247",
    backgroundColor: "#FFF8F0",
    marginRight: 8,
    marginBottom: 8,
  },
  pillActive: { backgroundColor: "#C7A247" },
  pillText: { color: "#5A4309" },
  filterRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 12 },
});
