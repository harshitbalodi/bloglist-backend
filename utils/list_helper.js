const {info} = require('./loggers');

const dummy = (blogs) =>{
return 1;
}

const totalLikes = (blogs)=>{
    const sumofLikes = blogs.reduce((sum, ele)=>{
        if(ele.likes !== undefined) return sum+ele.likes;
        return sum;
    },0)
    return sumofLikes;
}

const favouriteBlog = (blogs) =>{
    const favourite = blogs.reduce((favourite, cur) =>{
        if(cur.likes > favourite.likes)  return favourite=cur; 
        return favourite;
    },{likes:-1})
    return favourite;
}

module.exports = {
    dummy, totalLikes, favouriteBlog
}

