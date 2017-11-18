#include <iostream>
#include <stdlib.h>
#include <time.h>
#include <unistd.h>

using namespace std;

int main() {
	usleep(500000);
	srand(time(NULL));
	int output = (rand() % 10);
	cout << output;
	return 0;
}
