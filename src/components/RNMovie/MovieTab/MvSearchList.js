import React, { Component } from 'react'
import MovieStars from './MovieStars.js'
import { View, Text, ActivityIndicator, FlatList, TouchableHighlight, Image, StyleSheet } from 'react-native'
import { Actions } from 'react-native-router-flux'

class MvSearchList extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            movies: [], // 电影列表
            nowPage: 1, // 当前的页码
            pageSize: 15, // 每页显示的记录条数
            isloading: true // 是否正在加载数据
        }
        console.log(props.q+'xxxxxxx')
    }

    render() {
        if (this.state.isloading) {
            return <ActivityIndicator size="large"></ActivityIndicator>
        }
        {/*FlatList是一个高性能的列表组件,它是ListView组件的升级版,性能方面有了很大的提升 */ }
        return  (
            <FlatList
              data={this.state.movies}
              keyExtractor={(item, i) => i} // 解决 key 问题
              renderItem={({ item }) => this.renderItem(item)} // 调用方法，去渲染每一项
              ItemSeparatorComponent={this.renderSeparator} //渲染分割线的属性方法
              onEndReachedThreshold={0.5} // 距离底部还有多远的时候，触发加载更多的事件
              onEndReached={this.loadNextPage} // 当距离不足 0.5 的时候，触发这个方法，加载下一页数据
            />
        )  
    }

    componentDidMount() {
        this.getMoviesByPage()
    }

    // 根据页码获取电影列表
    getMoviesByPage = () => {
        const start = (this.state.nowPage - 1) * this.state.pageSize
        // const url = `http://api.douban.com/v2/movie/in_theaters?apikey=0df993c66c0c636e29ecbb5344252a4a&start=${start}&count=${this.state.pageSize}`
        // const url = `https://douban.uieee.com/v2/movie/top250?start=${start}&count=${this.state.pageSize}`
        const url = `http://t.yushu.im/v2/movie/search?q=${this.props.q}&start=0&count=40`
        //在RN中要发送网络请求，可以直接用fetch()
        fetch(url)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                // const movies=data.subjects;
                this.setState({
                    isloading: false,
                    movies: data.subjects
                })
                // this.setState((state) => {
                //     //if()
                //     // console.log(movies.id)

                //     return {
                //         isloading: false,
                //         movies: data.subjects
                //     }
                // })
            })
            //console.log(movies)
    }

    renderItem = (item) => {
        return <TouchableHighlight underlayColor="#fff" onPress={()=>Actions.moviedetail({id:item.id})}>
            <View style={{ flexDirection: 'row', padding: 10 }}>
            <Image source={{ uri: item.images.large }} style={{ width: 100, height: 140, marginRight: 10 }}></Image>
                <View style={{ justifyContent: 'space-around' }}>
                    <Text><Text style={styles.movieTitle}>电影名称：</Text>{item.title}</Text>
                    <Text><Text style={styles.movieTitle}>电影类型：</Text>{item.genres.join(',')}</Text>
                    <Text><Text style={styles.movieTitle}>主演：</Text>{item.casts.length>0?item.casts[0].name:""},{item.casts.length>1?item.casts[1].name:""}</Text>
                    <Text><Text style={styles.movieTitle}>制作年份：</Text>{item.year}年</Text>
                    <MovieStars stars={item.rating.stars}></MovieStars>
                </View>
            </View>
        </TouchableHighlight>
    }

    // 渲染分割线
    renderSeparator = () => {
        return <View style={{ borderTopColor: '#ccc', borderTopWidth: 1, marginLeft: 10, marginRight: 10 }}></View>
    }

    // 加载下一页
    loadNextPage = () => {
        // 如果下一页的页码值，大于总页数了，直接return
        this.setState({
            nowPage: this.state.nowPage + 1
        }, function () {
            this.getMoviesByPage()
        })
    }
}

const styles = StyleSheet.create({
    movieTitle: {
        fontWeight: 'bold'
    }
})

export default MvSearchList;