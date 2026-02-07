package org.urbanmind.UrbanChats;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication(
	    exclude = {
	            org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration.class,
	            org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration.class
	        }
	    )
@org.springframework.context.annotation.ComponentScan("org.urbanmind")
@org.springframework.boot.autoconfigure.domain.EntityScan("org.urbanmind")
@org.springframework.data.jpa.repository.config.EnableJpaRepositories("org.urbanmind")
@EnableDiscoveryClient
public class UrbanChatsApplication {

	public static void main(String[] args) {
		SpringApplication.run(UrbanChatsApplication.class, args);
	}
	
	@org.springframework.context.annotation.Bean
	@org.springframework.cloud.client.loadbalancer.LoadBalanced
	public org.springframework.web.client.RestTemplate restTemplate() {
		return new org.springframework.web.client.RestTemplate();
	}

}
