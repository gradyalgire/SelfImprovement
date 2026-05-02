function loadForm(type, clickedButton) {

    const container = document.getElementById('recommendation-form');
    const buttons = document.querySelectorAll(".recommendation-option");

    // remove active styling from current button
    buttons.forEach(button => {
        button.classList.remove("active");
    });

    const formTriggers = `
        <div class="recommendation-form-group">
            <label for="triggers"><strong>Trigger Warnings</strong> (optional)</label>
            <input type="text" id="triggers" name="triggers" placeholder="e.g. grief, loneliness, addiction">
        </div>
    `;

    const formReason = `
        <hr class="form-divider">
        <div class="recommendation-form-group">
            <label for="reason"><strong>Why should this be added?</strong></label>
            <p class="recommendation-form-note">Explain how this helped you and why it supports self-improvement, growth, or rebuilding.</p>
            <textarea id="reason" name="reason" rows="5" required placeholder="Please be specific. How did this help you? What mindset does it reinforce?"></textarea>
        </div>
        <div class="recommendation-form-group">
            <label for="context"><strong>What were you going through when you found this?</strong> <span class="field-optional">(optional)</span></label>
            <p class="recommendation-form-note">This helps reviewers understand the emotional context it addresses.</p>
            <textarea id="context" name="context" rows="3" placeholder="e.g. Going through a breakup, dealing with addiction, trying to stay motivated..."></textarea>
        </div>
    `;

    const formSubmission = `
        <hr class="form-divider">
        <div class="recommendation-form-group">
            <label for="email"><strong>Your Email Address</strong></label>
            <p class="recommendation-form-note">Only used to follow up on your submission. Never shared.</p>
            <input type="email" id="email" name="email" required placeholder="you@example.com">
        </div>
        <div class="recommendation-form-group">
            <button type="submit" class="recommendation-form-submit">Submit Recommendation</button>
            <p class="recommendation-form-note">Submissions are reviewed manually and may not be added.</p>
        </div>
    `;

    switch (type) {
        case "song":
            container.innerHTML = `
                <form class="recommendation-form netlify">
                    <fieldset>
                        <legend>Song Details</legend>
                        <div class="recommendation-form-group">
                            <label for="title"><strong>Title</strong></label>
                            <input type="text" id="title" name="title" required placeholder="e.g. The Mountain Is You">
                        </div>
                        <div class="recommendation-form-group">
                            <label for="artist"><strong>Artist</strong></label>
                            <input type="text" id="artist" name="artist" required placeholder="e.g. Chance Peña">
                        </div>
                        ${formTriggers}
                        <div class="recommendation-form-group checkbox">
                            <input type="checkbox" id="explicit" name="explicit">
                            <label for="explicit">This song contains explicit content</label>
                        </div>
                        ${formReason}
                        ${formSubmission}
                    </fieldset>
                </form>
            `;
            break;
        case "media":
            container.innerHTML = `
                <form class="recommendation-form netlify">
                    <fieldset>
                        <legend>Media Details</legend>
                        <div class="recommendation-form-group">
                            <label for="type"><strong>Media type</strong></label>
                            <select id="type" name="type">
                                <option value="">-- Select Media Type --</option>
                                <option value="podcast">Podcast</option>
                                <option value="book">Book</option>
                                <option value="video">Video</option>
                                <option value="movie">Movie</option>
                                <option value="quote">Quote</option>
                            </select>
                        </div>
                        <div class="recommendation-form-group">
                            <label for="title"><strong>Title</strong></label>
                            <input type="text" id="title" name="title" required placeholder="e.g. Mindset Mentor">
                        </div>
                        <div class="recommendation-form-group">
                            <label for="artist-author-creator"><strong>Artist / Author / Creator</strong></label>
                            <input type="text" id="artist-author-creator" name="artist-author-creator" required placeholder="e.g. Rob Dial">
                        </div>
                        <div class="recommendation-form-group">
                            <label for="link"><strong>Link</strong> (Spotify, Goodreads, Youtube, Letterboxd, etc...)</label>
                            <input type="text" id="link" name="link" placeholder="https://...">
                        </div>
                        ${formTriggers}
                        ${formReason}
                        ${formSubmission}
                    </fieldset>
                </form>
            `;
            break;
        case "trigger":
            container.innerHTML = `
                <form class="recommendation-form netlify">
                    <fieldset>
                        <legend>Trigger Details</legend>
                        <div class="recommendation-form-group">
                            <label for="target-title"><strong>Which song or media item is this trigger for?</strong></label>
                            <input type="text" id="target-title" name="target_title" placeholder="e.g. The Mountain Is You - Chance Peña">
                        </div>
                        ${formReason}
                        ${formSubmission}
                    </fieldset>
                </form>
            `;
            break;
        case "other":
            container.innerHTML = `
                <form class="recommendation-form netlify">
                    <fieldset>
                        <legend>Your Recommendation</legend>
                        <div class="recommendation-form-group">
                            <label for="suggestion"><strong>What are you suggesting?</strong></label>
                            <p class="recommendation-form-note">Suggest anything that does not fit into the other categories.</p>
                            <textarea id="suggestion" name="suggestion" rows="5" required placeholder="Describe your recommendation"></textarea>
                        </div>
                        ${formReason}
                        ${formSubmission}
                    </fieldset>
                </form>
            `;
            break;
        default:
            console.log("Error: unknown type");
    }

    // add active styling to clicked button
    buttons[clickedButton].classList.add("active");
}

loadForm("song", 0);