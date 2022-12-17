import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Button,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {updateLocale} from 'yargs';
import database from '@react-native-firebase/database';

const App = () => {
  let [todos, setTodos] = useState([]);
  let [value, setValue] = useState('');
  let [editValue, setEditValue] = useState('');
  const getData = () => {
    database()
      .ref('todos')
      .on('value', function (data) {
        if (data.val()) {
          setTodos(Object.values(data.val()));
        } else {
          setTodos([]);
        }
      });
  };
  useEffect(() => {
    getData();
  }, []);
  const addTodo = () => {
    let key = database().ref('todos').push().key;
    let obj = {
      title: value,
      edit: false,
      key,
    };
    database().ref('todos').child(key).set(obj);
    console.log(key);
    setTodos([obj, ...todos]);

    setValue('');
  };
  const setVal = e => {
    setValue(e);
  };

  const delTodo = index => {
    database().ref(`/todos/${todos[index]?.key}`).remove();
    getData();
  };

  const delAll = () => {
    database().ref(`/todos`).remove();
    getData();
  };

  const editTodo = (index, value) => {
    todos[index].edit = true;
    setTodos([...todos]);
    setEditValue(todos[index]?.title);
  };
  const upgrade = i => {
    if (editValue !== '') {
      let obj = {
        title: editValue,
        edit: false,
        key: todos[i].key,
      };
      database().ref('todos').child(todos[i].key).set(obj);
      todos[i].edit = false;
      getData();
      setEditValue('');
    } else {
      alert('Type something to edit.');
    }
  };
  return (
    <ImageBackground
      source={{
        uri: 'https://media.istockphoto.com/photos/check-off-a-todo-list-with-a-black-pen-picture-id1212554542?k=6&m=1212554542&s=612x612&w=0&h=dAEORdxXuwjVzkuSvnqNfZaCD1mNq9dupvQzqyKooh8=',
      }}
      style={{width: '100%', height: '100%'}}>
      <ScrollView>
        <View style={{flex: 1, alignItems: 'center'}}>
          <TextInput
            placeholder={'Enter Value'}
            value={value}
            onChangeText={text => setVal(text)}
            style={{
              height: 40,
              width: '80%',
              backgroundColor: '#878787',
              marginTop: 80,
              borderRadius: 5,
              fontSize: 16,
            }}
          />
          {value !== '' ? (
            <TouchableOpacity
              onPress={addTodo}
              activeOpacity={0.6}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: '80%',
                backgroundColor: '#222222',
                color: '#fafafa',
                marginTop: 10,
                borderRadius: 5,
              }}>
              <Text style={{color: '#fafafa', fontSize: 16}}>Add Todo</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={addTodo}
              activeOpacity={0.6}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: '80%',
                backgroundColor: '#222222',
                color: '#fafafa',
                marginTop: 10,
                borderRadius: 5,
                display: 'none',
              }}>
              <Text style={{color: '#fafafa', fontSize: 16}}>Add Todo</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={delAll}
            activeOpacity={0.6}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: '80%',
              backgroundColor: '#222222',
              color: '#fafafa',
              marginTop: 10,
              borderRadius: 5,
            }}>
            <Text style={{color: '#fafafa', fontSize: 16}}>Delete All</Text>
          </TouchableOpacity>

          <View style={{marginTop: 20}}>
            {todos.map((v, i) => {
              return (
                <View key={i} style={{}}>
                  <View
                    style={{
                      padding: 2,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: 7,
                      borderWidth: 1,
                      borderRadius: 5,
                    }}>
                    {v.edit ? (
                      <TextInput
                        onChangeText={val => setEditValue(val)}
                        defaultValue={v.title}
                        keyboardType="default"
                        style={{fontSize: 16, color: 'black'}}
                      />
                    ) : (
                      <Text style={{fontSize: 16}}>{v.title}</Text>
                    )}
                    <View style={{flexDirection: 'row'}}>
                      {/* <Button title= "Edit"></Button>
            <Button title= "Delete"></Button> */}
                      {v.edit ? (
                        <TouchableOpacity
                          onPress={() => upgrade(i)}
                          activeOpacity={0.6}
                          style={{
                            width: '35%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#222222',
                            color: '#fafafa',
                            borderRadius: 5,
                          }}>
                          <Text style={{color: '#fafafa', fontSize: 16}}>
                            Update
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={() => editTodo(i, v)}
                          activeOpacity={0.6}
                          style={{
                            width: '35%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#222222',
                            color: '#fafafa',
                            borderRadius: 5,
                          }}>
                          <Text style={{color: '#fafafa', fontSize: 16}}>
                            Edit
                          </Text>
                        </TouchableOpacity>
                      )}

                      <TouchableOpacity
                        onPress={() => delTodo(i)}
                        activeOpacity={0.6}
                        style={{
                          width: '35%',
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: '#222222',
                          color: '#fafafa',
                          borderRadius: 5,
                        }}>
                        <Text style={{color: '#fafafa', fontSize: 16}}>
                          Delete
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 100,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
});

export default App;
