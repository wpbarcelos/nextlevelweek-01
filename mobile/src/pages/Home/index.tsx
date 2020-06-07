import React, { useState, useEffect } from "react";
import { Feather as Icon } from "@expo/vector-icons/";
import {
  View,
  Image,
  ImageBackground,
  Text,
  StyleSheet,
  Alert,
} from "react-native";

import { RectButton } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

import RNPickerSelect from "react-native-picker-select";

interface IBGEUFResponse {
  sigla: string;
}
interface IBGECityResponse {
  nome: string;
}

const Home: React.FC = () => {
  const navigation = useNavigation();

  const [selectedUF, setSelectedUF] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    axios
      .get<IBGEUFResponse[]>(
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
      )
      .then((response) => {
        const ufInitials = response.data.map((uf) => uf.sigla);
        setUfs(ufInitials.sort());
      });
  }, []);

  useEffect(() => {
    axios
      .get<IBGECityResponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`
      )
      .then((response) => {
        const cities = response.data.map((city) => city.nome);
        setCities(cities);
      });
  }, [selectedUF]);

  function handleNavigateToPoints() {
    if (selectedCity === "" || selectedUF === "") {
      Alert.alert("Atenção", "Informe o estado e a cidade para continuar.");
      return;
    }

    navigation.navigate("Points", {
      uf: selectedUF,
      city: selectedCity,
    });
  }

  return (
    <ImageBackground
      style={styles.container}
      source={require("../../assets/home-background.png")}
      imageStyle={{ width: 274, height: 368 }}
    >
      <View style={styles.main}>
        <Image source={require("../../assets/logo.png")} resizeMode="contain" />
        <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
        <Text style={styles.description}>
          Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.
        </Text>
      </View>
      <View style={styles.footer}>
        {ufs && (
          <RNPickerSelect
            onValueChange={(value) => {
              setSelectedUF(value);
              setSelectedCity("");
            }}
            placeholder={{
              label: "Digite o estado",
              value: "",
            }}
            items={ufs.map((uf) => ({ label: uf, value: uf }))}
          />
        )}
        {ufs && (
          <RNPickerSelect
            onValueChange={(value) => setSelectedCity(value)}
            placeholder={{
              label: "Digite a cidade",
              value: "",
            }}
            items={cities.map((city) => ({ label: city, value: city }))}
          />
        )}

        <RectButton style={styles.button} onPress={handleNavigateToPoints}>
          <View style={styles.buttonIcon}>
            <Icon name="arrow-right" color="#fff" size={24} />
          </View>
          <Text style={styles.buttonText}>Entrar</Text>
        </RectButton>
      </View>
    </ImageBackground>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    backgroundColor: "#f0f0f5",
  },

  main: {
    flex: 1,
    justifyContent: "center",
  },

  title: {
    color: "#322153",
    fontSize: 32,
    fontFamily: "Ubuntu_700Bold",
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: "#6C6C80",
    fontSize: 16,
    marginTop: 16,
    fontFamily: "Roboto_400Regular",
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#34CB79",
    height: 60,
    flexDirection: "row",
    borderRadius: 10,
    overflow: "hidden",
    alignItems: "center",
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    flex: 1,
    justifyContent: "center",
    textAlign: "center",
    color: "#FFF",
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
  },
});
