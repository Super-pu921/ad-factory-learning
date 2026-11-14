/** Open opt-in configuration through native summaries before testing raw input contracts. */
export async function revealTeachingControls(root){
 const panels=root.locator('details[data-teaching-settings],details[data-advanced-input]');
 for(let index=0;index<await panels.count();index++){
  const panel=panels.nth(index);if(await panel.getAttribute('open')!==null)continue;
  const summary=panel.locator(':scope > summary');await summary.focus();await summary.press('Enter');
  if(await panel.getAttribute('open')===null)throw new Error('Teaching settings did not open through the keyboard');
 }
}
