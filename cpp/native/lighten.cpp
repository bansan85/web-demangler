#include <cctype>
#include <cmath>
#include <stdexcept>
#include <string>

namespace web_lighten {

namespace {
std::string dec(const std::string &num);

std::string inc(const std::string &num) {
  if (num[0] == '-') {
    std::string positive = num.substr(1);
    return "-" + dec(positive);
  }

  std::string retval = num;
  int more = 1;
  for (int i = retval.size() - 1; i >= 0 && more > 0; --i) {
    if (retval[i] == '9') {
      retval[i] = '0';
    } else {
      retval[i]++;
      more = 0;
    }
  }
  if (more > 0) {
    retval.insert(retval.begin(), '1');
  }
  return retval;
}

std::string dec(const std::string &num) {
  if (num[0] == '-') {
    std::string positive = num.substr(1);
    return "-" + inc(positive);
  }

  std::string retval = num;
  int less = 1;
  for (int i = retval.size() - 1; i >= 0 && less > 0; --i) {
    if (retval[i] == '0') {
      retval[i] = '9';
    } else {
      retval[i]--;
      less = 0;
    }
  }
  if (retval[0] == '0' && retval.size() > 1) {
    retval.erase(retval.begin());
  }
  return retval;
}

} // namespace

std::string number(std::string num, size_t size) {
  if (size > 9) {
    throw std::runtime_error("The parameter size must be smaller than 10.");
  }

  size_t pos_null = num.find('\0');
  if (pos_null != std::string::npos) {
    num.resize(pos_null);
  }

  char *end = nullptr;
  long double val = strtold(num.c_str(), &end);
  bool valid_number = end != num.c_str() && *end == '\0' && val != HUGE_VALL &&
                      !isspace(num[0]);

  if (!valid_number) {
    return {};
  }

  // Remove decimal separator
  size_t pos = num.find('.');
  if (pos != std::string::npos) {
    num = num.substr(0, pos) + num.substr(pos + 1, num.length() - pos - 1);
  } else {
    pos = num.length();
  }

  // Truncate if 0000 is found.
  size_t pos0000 = num.find(std::string(size, '0'));
  if (pos0000 != std::string::npos) {
    num = num.substr(0, pos0000);
  }

  // Truncate if 9999 is found.
  size_t pos9999 = num.find(std::string(size, '9'));
  if (pos9999 != std::string::npos) {
    num = num.substr(0, pos9999);
    size_t old_length = num.length();
    if (old_length == 0) {
      num = "1";
    } else if (old_length == 1 && num[0] == '-') {
      num = "-1";
    } else {
      if (num[0] == '-') {
        num = dec(num);
      } else {
        num = inc(num);
      }
    }
    pos = pos - old_length + num.length();
  }

  if (pos != std::string::npos) {
    if (pos > num.length()) {
      num = num + std::string(pos - num.length(), '0');
    } else if (pos < num.length()) {
      num = num.substr(0, pos) + '.' + num.substr(pos, num.length() - pos);
    }
  }

  return num;
}

} // namespace web_lighten
