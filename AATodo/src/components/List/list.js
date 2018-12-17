
import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, ScrollView, TouchableOpacity} from 'react-native';
import Checkbox from '../Checkbox/checkbox'

class List extends Component {

   
    renderItem = (item, i) => {
        const itemStyle = item.completed? [styles.item,styles.completed]:styles.item
        const {makeCheck, removeItem} = this.props
        return (
            <View key={i} style={itemStyle}>
                <Text style={styles.title}>{item.title}</Text>
                <View style={styles.row}>
                    <Checkbox checked={item.completed} makeCheck={()=>makeCheck(item,i)}/>
                    <TouchableOpacity onPress={()=>removeItem(item,i)}>
                        <Text style={styles.remove}>&times;</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    render() {
        const {data} = this.props
        return (
        <ScrollView>
            {
                data.map(this.renderItem)
            }
        </ScrollView>
        );
    }
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: 'lightblue',
    padding: 10,
  },
  item: {
    paddingVertical: 5,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: 'black',
    borderBottomWidth:1,
  },
  row:{
    flexDirection: 'row', 
    alignItems:'center',
    justifyContent: 'space-between',
    width: '20%',
  },
  remove:{
    fontSize: 26,
    color:'red',
    marginBottom: 5,
  },
  completed:{
    backgroundColor: '#D2D2D2'
  },
  title:{
    fontSize: 20
  }
});

export default List;