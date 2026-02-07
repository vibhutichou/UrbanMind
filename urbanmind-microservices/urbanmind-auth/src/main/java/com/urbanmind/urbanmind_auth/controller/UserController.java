//package com.urbanmind.urbanmind_auth.controller;
//
//import java.util.List;
//
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PatchMapping;
//import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.PutMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.RestController;
//
//import com.urbanmind.urbanmind_auth.entity.User;
//import com.urbanmind.urbanmind_auth.service.UserService;
//import com.urbanmind.urbanmind_auth.service.VerificationService;
//
//@RestController
//@RequestMapping("/users")
//public class UserController {
//
//    private final UserService userService;
//    private final VerificationService verificationService;
//
//    public UserController(
//            UserService userService,
//            VerificationService verificationService
//    ) {
//        this.userService = userService;
//        this.verificationService = verificationService;
//    }
//
//    @GetMapping("/{id}")
//    public ResponseEntity<User> getById(@PathVariable Long id) {
//        return ResponseEntity.ok(userService.getById(id));
//    }
//
//    @GetMapping
//    public ResponseEntity<List<User>> getAll() {
//        return ResponseEntity.ok(userService.getAll());
//    }
//
//    @PutMapping("/{id}")
//    public ResponseEntity<User> update(
//            @PathVariable Long id,
//            @RequestBody User user
//    ) {
//        return ResponseEntity.ok(userService.update(id, user));
//    }
//
//    //Admin action
//    //Changes verification request status
//    @PatchMapping("/{id}/status")
//    public ResponseEntity<Void> updateStatus(
//            @PathVariable Long id,
//            @RequestParam String status
//    ) {
//        userService.updateStatus(id, status);
//        return ResponseEntity.ok().build();
//    }
//
////    
////    @PostMapping("/{id}/verify")
////    public ResponseEntity<String> verify(@PathVariable Long id) {
////        verificationService.createVerificationRequest(id);
////        return ResponseEntity.ok("Verification request submitted");
////    }
//    
//}
