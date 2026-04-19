package com.team10.appointments.config;

import com.team10.appointments.model.Branch;
import com.team10.appointments.model.Topic;
import com.team10.appointments.repository.BranchRepository;
import com.team10.appointments.repository.TopicRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final TopicRepository topicRepository;
    private final BranchRepository branchRepository;

    public DataInitializer(TopicRepository topicRepository, BranchRepository branchRepository) {
        this.topicRepository = topicRepository;
        this.branchRepository = branchRepository;
    }

    @Override
    public void run(String... args) {
        if (topicRepository.count() > 0) return;

        Topic checking     = topic("Checking Account");
        Topic savings      = topic("Savings Account");
        Topic cd           = topic("CD/Money Market Account");
        Topic studentBank  = topic("Student Banking");
        Topic autoLoans    = topic("Auto Loans");
        Topic homeEquity   = topic("Home Equity");
        Topic mortgage     = topic("Mortgage");
        Topic studentLoans = topic("Student Loans");
        Topic retirement   = topic("Saving for Retirement");
        Topic investment   = topic("Investment Account");
        Topic creditCard   = topic("Credit Card");
        Topic other        = topic("Other");

        topicRepository.saveAll(List.of(
                checking, savings, cd, studentBank, autoLoans,
                homeEquity, mortgage, studentLoans, retirement,
                investment, creditCard, other));

        branch("Downtown Branch",  "123 Main St, Kansas City, MO 64105",
                List.of(checking, savings, cd, mortgage, creditCard, other));

        branch("Westside Branch",  "456 Oak Ave, Kansas City, MO 64111",
                List.of(checking, autoLoans, homeEquity, creditCard, other));

        branch("Northpark Branch", "789 Pine Rd, Kansas City, MO 64116",
                List.of(checking, savings, cd, studentBank, autoLoans,
                        homeEquity, mortgage, studentLoans, retirement,
                        investment, creditCard, other));

        branch("Southgate Branch", "321 Elm St, Kansas City, MO 64132",
                List.of(checking, savings, studentBank, studentLoans, creditCard));

        branch("Eastview Branch",  "654 Maple Dr, Kansas City, MO 64125",
                List.of(checking, cd, investment, retirement, creditCard, other));
    }

    private Topic topic(String name) {
        Topic t = new Topic();
        t.setName(name);
        return t;
    }

    private void branch(String name, String address, List<Topic> topics) {
        Branch b = new Branch();
        b.setName(name);
        b.setAddress(address);
        b.setTopics(topics);
        branchRepository.save(b);
    }
}
