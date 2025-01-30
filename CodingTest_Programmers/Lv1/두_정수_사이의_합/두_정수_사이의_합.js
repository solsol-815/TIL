function solution(a, b) {
    var answer = 0;
    let min = Math.min(a, b);
    let max = Math.max(a, b);
    let sum = (max + min) * (max - min + 1) / 2;
    return answer = sum;
}