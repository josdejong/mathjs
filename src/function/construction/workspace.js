/**
 * Create a workspace. The function creates a new math.expr.Workspace object.
 *
 * Workspace manages a set of expressions. Expressions can be added, replace,
 * deleted, and inserted in the workspace. The workspace keeps track on the
 * dependencies between the expressions, and automatically updates results of
 * depending expressions when variables or function definitions are changed in
 * the workspace.
 *
 * Methods:
 *     var id = workspace.append(expr);
 *     var id = workspace.insertBefore(expr, beforeId);
 *     var id = workspace.insertAfter(expr, afterId);
 *     workspace.replace(expr, id);
 *     workspace.remove(id);
 *     workspace.clear();
 *     var expr   = workspace.getExpr(id);
 *     var result = workspace.getResult(id);
 *     var deps   = workspace.getDependencies(id);
 *     var changes = workspace.getChanges(updateSeq);
 *
 * Usage:
 *     var workspace = new math.workspace();
 *     var id0 = workspace.append('a = 3/4');
 *     var id1 = workspace.append('a + 2');
 *     console.log('a + 2 = ' + workspace.getResult(id1));
 *     workspace.replace('a=5/2', id0);
 *     console.log('a + 2 = ' + workspace.getResult(id1));
 *
 * @return {math.expr.Workspace} Workspace
 */
function workspace() {
    return new math.expr.Workspace();
}

math.workspace = workspace;
