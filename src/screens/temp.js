
              {/* Password Field */}
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  secureTextEntry={!passwordVisible}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                />
                <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
                  <Icon name={passwordVisible ? "visibility-off" : "visibility"} size={24} color="gray" />
                </TouchableOpacity>
              </View>
              {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}

              {/* Confirm Password Field */}
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  secureTextEntry={!confirmPasswordVisible}
                  onChangeText={handleChange("confirmPassword")}
                  onBlur={handleBlur("confirmPassword")}
                  value={values.confirmPassword}
                />
                <TouchableOpacity onPress={toggleConfirmPasswordVisibility} style={styles.eyeIcon}>
                  <Icon name={confirmPasswordVisible ? "visibility-off" : "visibility"} size={24} color="gray" />
                </TouchableOpacity>
              </View>
              {touched.confirmPassword && errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword}</Text>}