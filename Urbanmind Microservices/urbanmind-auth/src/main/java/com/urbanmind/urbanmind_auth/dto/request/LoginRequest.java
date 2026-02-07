//package com.urbanmind.urbanmind_auth.dto.request;
//
//
//
//public class LoginRequest {
//
//    private String email;
//    private String password;
//
//    public String getEmail() { return email; }
//    public void setEmail(String email) { this.email = email; }
//
//    public String getPassword() { return password; }
//    public void setPassword(String password) { this.password = password; }
//}
package com.urbanmind.urbanmind_auth.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class LoginRequest {

	@NotBlank
	@Email
	@Pattern(
	  regexp = "^[A-Za-z0-9._%+-]+@gmail\\.com$",
	  message = "Only gmail.com emails are allowed"
	)
	private String email;

	@NotBlank
	private String password;
	 private boolean rememberMe;


    public String getEmail() { return email; }
   

    public String getPassword() { return password; }
    
    
    public boolean isRememberMe() { return rememberMe; }
}
