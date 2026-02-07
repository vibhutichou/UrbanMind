package com.urbanmind.donationnotification.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.urbanmind.donationnotification.dto.MarkDonationRequestDto;
import com.urbanmind.donationnotification.entity.Problem;
import com.urbanmind.donationnotification.exception.ResourceNotFoundException;
import com.urbanmind.donationnotification.repository.ProblemRepository;

import java.util.List;

@Service
public class ProblemServiceImpl implements ProblemService {

    private final ProblemRepository problemRepository;

    @Autowired
    public ProblemServiceImpl(ProblemRepository problemRepository) {
        this.problemRepository = problemRepository;
    }

    @Override
    @Transactional
    public Problem markDonation(Long problemId, MarkDonationRequestDto dto) {
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new ResourceNotFoundException("Problem", "id", problemId));

        problem.setDonationRequired(dto.getDonationRequired());
        problem.setRequiredAmount(dto.getRequiredAmount());

        return problemRepository.save(problem);
    }

    @Override
    public List<Problem> getDonationRequiredProblems() {
        return problemRepository.findByDonationRequiredTrue();
    }

    @Override
    public Problem getProblemById(Long id) {
        return problemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Problem", "id", id));
    }
}
