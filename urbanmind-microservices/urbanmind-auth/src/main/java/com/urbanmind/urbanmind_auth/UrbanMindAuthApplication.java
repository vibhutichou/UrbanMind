package com.urbanmind.urbanmind_auth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@EnableDiscoveryClient
@SpringBootApplication
public class UrbanMindAuthApplication {

	public static void main(String[] args) {
		SpringApplication.run(UrbanMindAuthApplication.class, args);
	}

}
