import { Injectable } from '@angular/core';

export const codes = [
/////////// 7. ArrayAverage ///////////////
`#include <iostream>
using namespace std;

int main() {
    int input[] = {4,2,3,5,1};
    int number1 = 0;
    int number2 = 0;

    while (number1 < sizeof(input)/sizeof(int)) {
        number2 = number2 + input[number1];
        number1 = number1 + 1;
    }

    float result = number2 / (float)number1;
    cout << result << endl;
}`
, /////////// 4. IntertwineTwoWords ///////////////
`#include <iostream>
using namespace std;

int main() {
    string word1 = "abc";
    string word2 = "def";
    string result = "";

    if (word1.length() == word2.length()) {
        for (int i = 0; i < word1.length(); i++) {
            result = result + word1.at(i) + word2.at(i);
        }
    }

    cout << result << endl;
}`
, /////////// 5. Palindrome ///////////////
`#include <iostream>
using namespace std;

int main() {
    string input = "abba";
    bool result = true;

    for (int i = 0, j = input.length() - 1; i < input.length() / 2; i++, j--) {
        if (input.at(i) != input.at(j)) {
            result = false;
            break;
        }
    }

    cout << (result ? "true" : "false") << endl;
}`
, /////////// 2. countSameCharsAtSamePosition ///////////////
`#include <iostream>
using namespace std;

int main() {
    string string1 = "Magdeburg";
    string string2 = "Hamburg";

    int length;
    if (string1.length() < string2.length())
        length = string1.length();
    else length = string2.length();

    int result = 0;

    for (int i = 0; i < length; i++) {
        if (string1.at(i) == string2.at(i)) {
            result++;
        }
    }
    cout << result << endl;
}`
// , /////////// 3. CountVowels ///////////////
// `#include <iostream>
// using namespace std;
//
// int main() {
//     string input = "Some input string";
//     char chars[] = {'a', 'e', 'i', 'o', 'u'};
//     int result = 0;
//
//     for (int i = 0; i < input.length(); i++) {
//         for (int j = 0; j < sizeof(chars)/sizeof(char); j++) {
//             if (input.at(i) == chars[j]) {
//                 result++;
//             }
//         }
//     }
//     cout << result << endl;
// }`
// , /////////// 6. ReverseWord ///////////////
// `#include <iostream>
// using namespace std;
//
// int main() {
//     string input = "Hello world";
//     string result = "";
//
//     for (int i = input.length() - 1; i >= 0; i--) {
//         result += input.at(i);
//     }
//
//     cout << result << endl;
// }`
, /////////// 1. ContainsSubstring ///////////////
  `#include <iostream>
using namespace std;

int main() {
    string word1 = "abcdefg";
    string word2 = "acd";
    bool result = false;
    for (int i = 0; i < word1.length(); i++) {
        for (int j = 0; j < word2.length(); j++) {
            if (i + j >= word1.length())
                break;
            if (word1.at(i + j) != word2.at(j)) {
                break;
            } else {
                if (j == word2.length() - 1) {
                    result = true;
                }
            }
        }
    }
    cout << (result ? "true" : "false") << endl;
}`
, /////////// 8. BinaryToDecimal ///////////////
`#include <iostream>
#include <cmath>
using namespace std;

int main() {
    int number = 11;
    if (number < 0)
        return -1;

    int result = 0;
    int tempNumber = number;
    int variable = 0;

    for (int i = 0; tempNumber > 0; i++) {
        variable = tempNumber % 10;
        result = result + variable * (int) pow(2, i);
        tempNumber = tempNumber / 10;
    }

    cout << result << endl;
}`
// , /////////// 9. CrossSum ///////////////
// `#include <iostream>
// using namespace std;
//
// int main() {
//     int number = 323;
//     int result = 0;
//
//     while (number != 0) {
//         result += number % 10;
//         number /= 10;
//     }
//     cout << result << endl;
// }`
// , /////////// 10. FirstAboveThreshold ///////////////
// `#include <iostream>
// using namespace std;
//
// int main() {
//     int number1 = 5;
//     int array[] = {1, 5, 6, 3, 7};
//     for (int i = 0; i < sizeof(array)/sizeof(int); i++) {
//         int number2 = array[i];
//
//         if (number2 > number1) {
//             cout << number2 << endl;
//             break;
//         }
//     }
// }`
// , /////////// 11. Power ///////////////
// `#include <iostream>
// using namespace std;
//
// int main() {
//     int num1 = 2;
//     int num2 = 3;
//     int result = num1;
//     if (num2 == 0)
//         cout << 1 << endl;;
//
//     for (int i = 1; i < num2; i++) {
//         result = result * num1;
//     }
//
//     cout << result << endl;
// }`
//  , /////////// SquareRoot ///////////////

// , /////////// Factorial ///////////////
// `#include <cstdio>
// using namespace std;
//
// int main() {
//     int result = 1;
//     int x = 4;
//
//     while (x > 1) {
//         result = result * x;
//         x--;
//     }
//     printf("%d", result);
// }`
// , /////////// MaxInArray ///////////////
// `#include <iostream>
// #include <array>
// using namespace std;
//
// int main() {
//     int array[] = {2, 19, 5, 17};
//     int result = array[0];
//     for (unsigned int i = 1; i < sizeof(array)/sizeof(int); i++)
//         if (array[i] > result)
//             result = array[i];
//     cout << result << endl;
// }`
// , /////////// SumUpToN ///////////////
// `#include <iostream>
// int main() {
//   int n = 4;
//   int result = 0;
//   for (int i = 1; i <= n; i++)
//       result = result + i;
//   cout << result << endl;
// }`
];

@Injectable({
  providedIn: 'root'
})
export class CodeService {

  constructor() {
  }

  getCode(assignment: number) {
    return codes[assignment];
  }

  get numberOfCodes(): number {
    return codes.length;
  }
}
