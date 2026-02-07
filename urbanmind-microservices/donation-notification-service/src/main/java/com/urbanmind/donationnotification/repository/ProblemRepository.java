package com.urbanmind.donationnotification.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.urbanmind.donationnotification.entity.Problem;

import java.util.List;

@Repository
public interface ProblemRepository extends JpaRepository<Problem, Long> {
    List<Problem> findByDonationRequiredTrue();
}
