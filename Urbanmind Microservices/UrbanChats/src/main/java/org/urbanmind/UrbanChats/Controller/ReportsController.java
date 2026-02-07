
package org.urbanmind.UrbanChats.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.urbanmind.UrbanChats.DTO.ReportRequestDto;
import org.urbanmind.UrbanChats.DTO.ReportResponseDto;
import org.urbanmind.UrbanChats.Service.ReportsService;

@RestController
@RequestMapping("/api/v1/reports")
public class ReportsController {

    @Autowired
    private ReportsService reportsService;

   
 // Create a report
    @PostMapping
    @PreAuthorize("#dto.reporterUserId == authentication.principal.id")
    public ReportResponseDto createReport(
            @jakarta.validation.Valid
            @RequestBody ReportRequestDto dto) {

        return reportsService.createReport(dto);
    }


    // Get report by ID (placeholder)
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ReportResponseDto getReportById(@PathVariable Long id) {
        return reportsService.getReportById(id);
    }

}
