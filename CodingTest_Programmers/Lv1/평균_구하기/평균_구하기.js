function solution(arr) {
    var answer = 0;
    for(let n of arr) {
        answer += n;
    }
    return answer / arr.length;
}