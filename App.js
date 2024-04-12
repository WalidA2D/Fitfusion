import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ImageBackground, Alert, Image  } from 'react-native';
import { Avatar } from '@rneui/themed';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';


function HomeScreen({ navigation }) {
  return (
    <ImageBackground  source={require('./assets/salle.png')} style={styles.background} > 
        <Image
              source={require('./assets/BOXING_CLUB-removebg-preview.png')} 
              style={styles.logo }
          />
        <View style={styles.container}>
          
          <Text style={styles.welcome}>Bienvenue</Text>
          
          <Text style={styles.title}></Text>
          <TouchableOpacity style={styles.button} title="Ouvrir" onPress={() => navigation.navigate('Details')}>
            <Text style={styles.buttonText}>Ouvrir</Text>
          </TouchableOpacity>
          <Text style={styles.title}></Text>
        </View>

    </ImageBackground>
  );
}
function DetailsScreen({ navigation }) {
  const [exercises, setExercises] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredient, setSelectedIngredient] = useState(null);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await fetch('https://wger.de/api/v2/exercisebaseinfo/');
        const data = await response.json();
        setExercises(data.results);
      } catch (error) {
        console.error('Error fetching exercises:', error);
      }
    };

    const fetchIngredients = async () => {
      try {
        const response = await fetch('https://wger.de/api/v2/ingredient/?limit=20');
        const data = await response.json();
        setIngredients(data.results);
      } catch (error) {
        console.error('Error fetching ingredients:', error);
      }
    };

    fetchExercises();
    fetchIngredients();
  }, []);

  const handleIngredientPress = (ingredient) => {
    setSelectedIngredient(ingredient);
    navigation.navigate('ScreenRecette', { ingredient });
  };

  return (
    <ImageBackground source={require('./assets/salle.png')} style={styles.background}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Image
          source={require('./assets/BOXING_CLUB-removebg-preview.png')}
          style={styles.logo}
        />
        <Text style={styles.header}>Exercices FitFusion</Text>
        <ScrollView horizontal={true} contentContainerStyle={styles.scrollViewContentHorizon}>
          {exercises
            .filter(exercise => exercise.images && exercise.images.length > 0)
            .map((exercise, index) => (
              <View key={index} style={styles.containerH}>
                <TouchableOpacity onPress={() => navigation.navigate('ExercicesScreen', { exerciseId: exercise.id })}>
                  <Image
                    source={{ uri: exercise.images[0].image }}
                    style={styles.exerciseImage}
                  />
                </TouchableOpacity>
              </View>
            ))}
        </ScrollView>
        <Text style={styles.header}>Nutrition FitFusion</Text>
        <ScrollView horizontal={true} contentContainerStyle={styles.scrollViewContentHorizon}>
          {ingredients.map((ingredient, index) => (
            <View key={index} style={styles.containerH}>
              <View style={styles.avatarContainer}>
              <TouchableOpacity onPress={() => navigation.navigate('ScreenRecette', { ingredientId: ingredient.id })}>
                <Text style={styles.title}>{ingredient.name}</Text>
              </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </ScrollView>
    </ImageBackground>
  );
}


function ExercicesScreen({ route, navigation }) {
  const { exerciseId } = route.params;
  const [exerciseInfo, setExerciseInfo] = useState(null);

  useEffect(() => {
    const fetchExerciseInfo = async () => {
        try {
            const response = await fetch(`https://wger.de/api/v2/exercisebaseinfo/${exerciseId}/`, {
                headers: {
                    'Authorization': 'Token addbd59f0564473979b982d3fc0e4e4fadd8d72e'
                }
            });
            const data = await response.json();
            setExerciseInfo(data);
        } catch (error) {
            console.error('Error fetching exercise info:', error);
        }
    };

    fetchExerciseInfo();
}, [exerciseId]);

  return (
    <ImageBackground  source={require('./assets/salle.png')} style={styles.background} > 
    <Image
              source={require('./assets/BOXING_CLUB-removebg-preview.png')} 
              style={styles.logo }
          />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.button} title="Home" onPress={() => navigation.navigate('Home')}>
            <Text style={styles.buttonText}>Home</Text>
          </TouchableOpacity>
          <View/>
          {exerciseInfo ? (
                <>
                    <Text style={styles.title}>Categorie: {exerciseInfo.category.name}</Text>
                    {exerciseInfo.exercises && exerciseInfo.exercises.length > 0 && (
                        <Text style={styles.title}>Nom de l'éxercise: {exerciseInfo.exercises[0].name}</Text>
                    )}
                    {exerciseInfo.exercises && exerciseInfo.exercises.length > 0 && (
                        <Text style={styles.title}>Description: {exerciseInfo.exercises[0].description.replace(/<[^>]+>/g, '')}</Text>
                    )}
                </>
            ) : (
                <Text>Chargement des exercises...</Text>
            )}

        </View>
      </ScrollView>
    </ImageBackground>
  );
}

function RecettesScreen({ route }) {
  const { ingredientId } = route.params;
  const [ingredientDetails, setIngredientDetails] = useState(null);

  useEffect(() => {
    const fetchIngredientDetails = async () => {
      try {
        const response = await fetch(`https://wger.de/api/v2/ingredient/${ingredientId}/`);
        const data = await response.json();
        setIngredientDetails(data);
      } catch (error) {
        console.error('Error fetching ingredient details:', error);
      }
    };

    fetchIngredientDetails();
  }, [ingredientId]);

  return (
    <ImageBackground source={require('./assets/salle.png')} style={styles.background}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          {ingredientDetails ? (
            <View style={styles.ingredientDetails}>
              <Text style={styles.title}>Nom de l'ingrédient: {ingredientDetails.name}</Text>
              <Text style={styles.title}>Énergie: {ingredientDetails.energy}</Text>
              <Text style={styles.title}>Protéines: {ingredientDetails.protein}</Text>
              <Text style={styles.title}>Fibres: {ingredientDetails.fibres}</Text>
              <Text style={styles.title}>Sodium: {ingredientDetails.sodium}</Text>
            </View>
          ) : (
            <Text style={styles.title}>Chargement des détails de l'ingrédient...</Text>
          )}
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Bienvenue' }} />
        <Stack.Screen name="Details" component={DetailsScreen} options={{ title: 'FitFusion' }} />
        <Stack.Screen name="ExercicesScreen" component={ExercicesScreen} options={{ title: 'Exercices FitFusion' }} />
        <Stack.Screen name="ScreenRecette" component={RecettesScreen} options={{ title: 'Recettes FitFusion' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}



const styles = StyleSheet.create({
  logo: {
    width: 300, 
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    marginLeft: 45, 
},
  avatarContainer: {
      flexDirection: 'row', 
      marginTop: 20,
      justifyContent: 'center', 
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  header: {
    backgroundColor: '#fff',
    width: '100%',
    paddingVertical: 15,
    alignItems: 'center',
    color: 'black',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: "center",
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  welcome: {
    fontFamily: 'Helvetica',
    fontSize: 50,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollViewContentHorizon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerH: {
    width: 250, 
    backgroundColor: '#ccc', 
    padding: 20,
    marginRight: 10,
  },
  text: {
    color: '#fff', 
    fontSize: 20,
    fontWeight: 'bold',
  },
  exerciseImage: {
    width: 50,
    height: 50,
    marginLeft: 'auto', 
    marginRight: 'auto', 
    marginTop: 'auto', 
    marginBottom: 'auto', 
  },
  ingredientView: {
    marginBottom: 10,
    backgroundColor: '#fff', 
    padding: 10, 
    borderRadius: 5, 
  },
});
export default App;
