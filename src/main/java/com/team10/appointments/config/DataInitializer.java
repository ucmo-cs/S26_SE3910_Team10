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

        Topic everydayBanking     = topic("Everyday Banking");
        Topic mortgages           = topic("Mortgages & Home Equity");
        Topic loans               = topic("Loans");
        Topic savingsInvestments  = topic("Savings & Investments");
        Topic creditCards         = topic("Credit Cards");
        Topic other               = topic("Other");

        topicRepository.saveAll(List.of(
                everydayBanking, mortgages, loans,
                savingsInvestments, creditCards, other));

        branch("Downtown Branch",  "123 Main St, Kansas City, MO 64105",
                List.of(everydayBanking, mortgages, savingsInvestments, creditCards, other));

        branch("Westside Branch",  "456 Oak Ave, Kansas City, MO 64111",
                List.of(everydayBanking, mortgages, loans, creditCards, other));

        branch("Northpark Branch", "789 Pine Rd, Kansas City, MO 64116",
                List.of(everydayBanking, mortgages, loans, savingsInvestments, creditCards, other));

        branch("Southgate Branch", "321 Elm St, Kansas City, MO 64132",
                List.of(everydayBanking, loans, creditCards));

        branch("Eastview Branch",  "654 Maple Dr, Kansas City, MO 64125",
                List.of(everydayBanking, savingsInvestments, creditCards, other));
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
