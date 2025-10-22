// App.tsx
import React, { useState } from "react";
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
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";

type MenuItem = {
  id: string;
  name: string;
  description: string;
  course: string;
  price: string;
};

// =============================
// HOME / MENU SCREEN
// =============================
function MenuScreen({ menuItems }: { menuItems: MenuItem[] }) {
  const [selectedCourse, setSelectedCourse] = useState("Starters");

  const filteredItems = menuItems.filter(
    (item) => item.course === selectedCourse
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Browse the Menu</Text>

      {/* Course tabs */}
      <View style={styles.courseTabs}>
        {["Starters", "Mains", "Desserts"].map((course) => (
          <TouchableOpacity
            key={course}
            style={[
              styles.tabButton,
              selectedCourse === course && styles.selectedTab,
            ]}
            onPress={() => setSelectedCourse(course)}
          >
            <Text
              style={
                selectedCourse === course
                  ? styles.selectedTabText
                  : styles.tabText
              }
            >
              {course}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Menu list */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.menuCard}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={styles.dishName}>{item.name}</Text>
              <Text style={styles.price}>R{item.price}</Text>
            </View>
            <Text style={styles.dishDescription}>{item.description}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No dishes in this course yet.</Text>
        }
      />
    </View>
  );
}

// =============================
// ADD DISH SCREEN
// =============================
function AddDishScreen({ onAddDish }: { onAddDish: (item: MenuItem) => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [course, setCourse] = useState("Starters");
  const [price, setPrice] = useState("");

  const handleSave = () => {
    if (!name.trim() || !price.trim()) {
      alert("Please fill in the dish name and price.");
      return;
    }

    const newDish: MenuItem = {
      id: Date.now().toString(),
      name: name.trim(),
      description: description.trim(),
      course,
      price: price.trim(),
    };

    onAddDish(newDish);
    setName("");
    setDescription("");
    setCourse("Starters");
    setPrice("");
    alert("Dish added successfully!");
  };

  const courses = ["Starters", "Mains", "Desserts"];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Add a New Dish</Text>

        <Text style={styles.label}>Dish Name:</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Grilled Salmon"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Description:</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          multiline
          placeholder="Short description"
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.label}>Select Course:</Text>
        <View style={styles.dropdown}>
          {courses.map((c) => (
            <TouchableOpacity
              key={c}
              style={[
                styles.dropdownOption,
                course === c && styles.selectedDropdownOption,
              ]}
              onPress={() => setCourse(c)}
            >
              <Text
                style={
                  course === c
                    ? styles.selectedDropdownText
                    : styles.dropdownText
                }
              >
                {c}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Price:</Text>
        <TextInput
          style={styles.input}
          placeholder="R 0.00"
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Dish</Text>
        </TouchableOpacity>

        {/* Display menu items summary */}
        <Text style={styles.subTitle}>Menu Items:</Text>
        <Text style={styles.summaryText}>
          (Once you add dishes, view them under the “Browse Menu” tab)
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// =============================
// MAIN APP
// =============================
const Tab = createBottomTabNavigator();

export default function App() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const addDish = (dish: MenuItem) => {
    setMenuItems((prev) => [...prev, dish]);
  };

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontSize: 14, fontWeight: "bold" },
          tabBarStyle: { backgroundColor: "#fff6f1" },
          headerStyle: { backgroundColor: "#fff6f1" },
          headerTintColor: "#b36b5e",
        }}
      >
        <Tab.Screen name="Browse Menu" options={{ title: "Browse Menu" }}>
          {() => <MenuScreen menuItems={menuItems} />}
        </Tab.Screen>
        <Tab.Screen name="Add Dish" options={{ title: "Add Dish" }}>
          {() => <AddDishScreen onAddDish={addDish} />}
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
    backgroundColor: "#fffaf7",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3b2d2a",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontWeight: "bold",
    color: "#3b2d2a",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#f1e3c8",
    borderWidth: 1,
    borderColor: "#d4b996",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    color: "#3b2d2a",
  },
  dropdown: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  dropdownOption: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#d4b996",
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  selectedDropdownOption: {
    backgroundColor: "#f1e3c8",
  },
  dropdownText: { color: "#3b2d2a" },
  selectedDropdownText: { color: "#b36b5e", fontWeight: "bold" },
  saveButton: {
    backgroundColor: "#f6cacc",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  saveButtonText: {
    color: "#3b2d2a",
    fontWeight: "bold",
    fontSize: 16,
  },
  courseTabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  tabButton: {
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 6,
  },
  selectedTab: {
    backgroundColor: "#f1e3c8",
  },
  tabText: { color: "#3b2d2a", fontWeight: "500" },
  selectedTabText: { color: "#b36b5e", fontWeight: "bold" },
  menuCard: {
    backgroundColor: "#f5f3ef",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d4b996",
    padding: 15,
    marginBottom: 10,
  },
  dishName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3b2d2a",
  },
  price: {
    color: "#b36b5e",
    fontWeight: "bold",
  },
  dishDescription: {
    color: "#555",
    marginTop: 4,
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    marginTop: 50,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    color: "#3b2d2a",
  },
  summaryText: {
    color: "#777",
    fontSize: 14,
    marginTop: 5,
  },
});