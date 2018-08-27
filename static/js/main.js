var $form,
    $formButtons,
    $progressbar,
    $progressbarButtons,
    $results,
    FINAL_STEP = 4;

document.addEventListener("DOMContentLoaded", function(event) {
    init();
    if($formButtons && $progressbarButtons){
        addEventToButtons($formButtons);
        addEventToButtons($progressbarButtons);
    }
});

function init(){
    $progressbar = document.getElementById('progressbar');
    if($progressbar){
        $progressbarButtons = $progressbar.querySelectorAll('li');
        $form = document.getElementById('diagnostic-form');
        $formButtons = $form.querySelectorAll("button");
        $results = document.getElementById('diagnostic-results');
    }
}

function addEventToButtons($buttons){
    $buttons.forEach(function($btn) {
        $btn.addEventListener("click", function(e){
            e.preventDefault();
            var dest = $btn.dataset.dest;
            var currentStep = $form.dataset.current

            if(dest !== currentStep && dest <= FINAL_STEP){
                if(canChangeStep(dest, currentStep)){
                    goToNextStep(dest);
                    formError(false);
                }else{
                    formError(true);
                }
                scrollToTop();
            }
        })
    });
}

function canChangeStep(nextStep, currentStep){
    //si la prochaine étape est supérieure à l'actuelle,
    // on vérifie que tous les bouttons radio des étapes précédentes sont cochés.
    return !(nextStep - currentStep > 0 && !arePreviousRadioChecked(nextStep)) ;
}

function goToNextStep(nextStep){
    var currentStep = $form.dataset.current;
    var $currentFieldSet = $form.querySelector('.step-' + currentStep);
    var $nextFieldSet = $form.querySelector('.step-' + nextStep);

    if(nextStep == FINAL_STEP){
        hide($form);
        show($results);
        updateResults();
    }else{
        show($form);
        show($nextFieldSet);
        hide($results);
    }
    $form.dataset.current = nextStep;
    if(currentStep != FINAL_STEP ){
        hide($currentFieldSet);
    }
    updateProgressBar(nextStep);
}

function arePreviousRadioChecked(nextStep){
    var result = true;

    for(var i = 1; i < nextStep; i++){
        result = result && areStepRadioChecked(i);
    }

    return result;
}

function areStepRadioChecked(step){
    var $fieldSet = $form.querySelector('.step-' + step);
    var labelCount = $fieldSet.querySelectorAll('label').length;
    var checkedInputsCount = $fieldSet.querySelectorAll(":checked").length;

    return labelCount/2 == checkedInputsCount;
}

function updateProgressBar(nextStep){
    $progressbarButtons.forEach(function($btn) {
        if(nextStep - $btn.dataset.dest  >= 0){
            $btn.classList.add('active');
        }else{
            $btn.classList.remove('active');
        }
    });
}

function updateResults(){
    var nbYesByStep = [];
    var nbYes;

    for(var i = 1; i < FINAL_STEP; i++){
        nbYes = countYesOfStep(i);
        $results.querySelector('.results-step-' + i).dataset.nbYes = nbYes;
        nbYesByStep[i-1] = nbYes;
    }

    var minimumNbYes = Array.min(nbYesByStep);
    var scenario = 3;
    if(minimumNbYes >= 3){
        scenario = 1;
    }else if(minimumNbYes >= 2){
        scenario = 2;
    }

    $results.querySelector('.container-links-scenario').dataset.scenario = scenario;

}

function countYesOfStep(step){
    var $fieldSet = $form.querySelector('.step-' + step);
    var $checkedInputs = $fieldSet.querySelectorAll(":checked");
    var count = 0;

    $checkedInputs.forEach(function($input) {
        if($input.value == 'true'){
            count++;
        }
    });

    return count;

}

function formError(showError){
    $element =  $form.querySelector('.error');
    if(showError){
        show($element);
    }else{
        hide($element);
    }
}

function hide($element){
    $element.classList.add('hidden');
}

function show($element){
    $element.classList.remove('hidden');
    document.title = $element.dataset.pageTitle;
}

function scrollToTop(){
    window.scrollTo(0, 0);
}

Array.min = function( array ){
    return Math.min.apply( Math, array );
};